import { MaxUint256 } from '@ethersproject/constants'
import { Trade, VVET } from '@uniswap/sdk'
import { find } from 'lodash'
import { useCallback, useMemo } from 'react'
import { ROUTER_ADDRESS } from '../constants'
import { useTokenAllowance } from '../data/Allowances'
import { Field } from '../state/swap/actions'
import { useTransactionAdder } from '../state/transactions/hooks'
import { computeSlippageAdjustedAmounts } from '../utils/prices'
import { useWeb3React } from './index'
import ERC20_ABI from '../constants/abis/erc20.json'

// returns a function to approve the amount required to execute a trade if necessary, otherwise null
export function useApproveCallback(trade?: Trade, allowedSlippage = 0): [undefined | boolean, () => Promise<void>] {
  const { account, chainId, library } = useWeb3React()
  const currentAllowance = useTokenAllowance(trade?.inputAmount?.token, account, ROUTER_ADDRESS)

  const slippageAdjustedAmountIn = useMemo(() => computeSlippageAdjustedAmounts(trade, allowedSlippage)[Field.INPUT], [
    trade,
    allowedSlippage
  ])

  const mustApprove = useMemo(() => {
    // we treat VVET as VET which requires no approvals
    if (trade?.inputAmount?.token?.equals(VVET[chainId])) return false
    // return undefined if we don't have enough data to know whether or not we need to approve
    if (!currentAllowance || !slippageAdjustedAmountIn) return undefined
    // slippageAdjustedAmountIn will be defined if currentAllowance is
    return currentAllowance.lessThan(slippageAdjustedAmountIn)
  }, [trade, chainId, currentAllowance, slippageAdjustedAmountIn])

  const addTransaction = useTransactionAdder()
  const approve = useCallback(async (): Promise<void> => {
    if (!mustApprove) return

    const abi = find(ERC20_ABI, { name: 'approve' })
    const method = library.thor.account(trade?.inputAmount?.token?.address).method(abi)

    const clause = method.asClause(ROUTER_ADDRESS, MaxUint256)

    return library.vendor
      .sign('tx', [{ ...clause }])
      .comment('approve')
      .request()
      .then(response => {
        addTransaction(response, {
          summary: 'Approve ' + trade?.inputAmount?.token?.symbol,
          approvalOfToken: trade?.inputAmount?.token?.symbol
        })
      })
      .catch(error => {
        console.debug('Failed to approve token', error)
        throw error
      })
  }, [library.thor, library.vendor, mustApprove, trade, addTransaction])

  return [mustApprove, approve]
}
