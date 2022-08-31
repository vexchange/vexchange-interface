import { MaxUint256 } from '@ethersproject/constants'
import { Trade, WVET, TokenAmount } from 'vexchange-sdk'
import { find } from 'lodash'
import { useCallback, useMemo } from 'react'
import { ROUTER_ADDRESS } from '../constants'
import { useTokenAllowance } from '../data/Allowances'
import { Field } from '../state/swap/actions'
import { useTransactionAdder, useHasPendingApproval } from '../state/transactions/hooks'
import { computeSlippageAdjustedAmounts } from '../utils/prices'
import { useWeb3React } from './index'
import ERC20_ABI from '../constants/abis/erc20.json'

export enum Approval {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED
}

// returns a function to approve the amount required to execute a trade if necessary, otherwise null
export function useApproveCallback(
  amountToApprove?: TokenAmount,
  addressToApprove?: string
): [Approval, () => Promise<void>] {
  const { account, library, connector } = useWeb3React()

  const currentAllowance = useTokenAllowance(amountToApprove?.token, account, addressToApprove)
  const pendingApproval = useHasPendingApproval(amountToApprove?.token?.address)
  const isNufintes = connector.constructor.name === 'NufinetesWeb3Provider'

  // check the current approval status
  const approval = useMemo(() => {
    // we treat WVET as VET which requires no approvals
    if (amountToApprove?.token?.equals(WVET[amountToApprove?.token?.chainId])) return Approval.APPROVED
    // we might not have enough data to know whether or not we need to approve
    if (!currentAllowance) return Approval.UNKNOWN
    // amountToApprove will be defined if currentAllowance is
    return currentAllowance.lessThan(amountToApprove)
      ? pendingApproval
        ? Approval.PENDING
        : Approval.NOT_APPROVED
      : Approval.APPROVED
  }, [amountToApprove, currentAllowance, pendingApproval])

  const addTransaction = useTransactionAdder()
  const abi = find(ERC20_ABI, { name: 'approve' })

  const approve = useCallback(async (): Promise<void> => {
    if (approval !== Approval.NOT_APPROVED) {
      console.error('approve was called unnecessarily, this is likely an error.')
      return
    }

    const method = library.thor.account(amountToApprove?.token?.address).method(abi)

    const clause = method.asClause(addressToApprove, MaxUint256)
    const comment = `Unlock ${amountToApprove?.token?.symbol}`
    let request

    if (isNufintes) {
      const clauseForCustomRequest = [{ comment, ...clause }]
      const transferTokenJSON = {
        id: 898998,
        jsonrpc: '2.0',
        method: 'vechain_transaction',
        params: [
          clauseForCustomRequest,
          {
            broadcast: true,
            chainId: (connector as any).chainId,
            signer: account
          }
        ]
      }
      request = (connector as any).sendCustomRequest(transferTokenJSON)
    } else {
      request = library.vendor
        .sign('tx', [{ ...clause }])
        .comment(comment)
        .request()
    }

    return request
      .then(response => {
        addTransaction(response, {
          summary: 'Unlock ' + amountToApprove?.token?.symbol,
          approvalOfToken: amountToApprove?.token?.address
        })
      })
      .catch(error => {
        console.debug('Failed to approve token', error)
      })
  }, [addTransaction, addressToApprove, amountToApprove, approval, abi, library.thor, library.vendor])

  return [approval, approve]
}

// wraps useApproveCallback in the context of a swap
export function useApproveCallbackFromTrade(trade?: Trade, allowedSlippage = 0) {
  const amountToApprove = useMemo(() => computeSlippageAdjustedAmounts(trade, allowedSlippage)[Field.INPUT], [
    trade,
    allowedSlippage
  ])
  return useApproveCallback(amountToApprove, ROUTER_ADDRESS)
}
