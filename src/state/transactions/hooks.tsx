import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useWeb3React } from '../../hooks'
import { AppDispatch, AppState } from '../index'
import { addTransaction } from './actions'
import { TransactionDetails } from './reducer'

// helper that can take a ethers library transaction response and add it to the list of transactions
export function useTransactionAdder(): (response, customData?: { summary?: string; approvalOfToken?: string }) => void {
  const { chainId, account } = useWeb3React()
  const dispatch = useDispatch<AppDispatch>()

  return useCallback(
    (response, { summary, approvalOfToken }: { summary?: string; approvalOfToken?: string } = {}) => {
      const { txid } = response
      if (!txid) {
        throw Error('No transaction hash found.')
      }
      dispatch(addTransaction({ hash: txid, from: account, chainId, approvalOfToken, summary }))
    },
    [dispatch, chainId, account]
  )
}

// returns all the transactions for the current chain
export function useAllTransactions(): { [txHash: string]: TransactionDetails } {
  const { chainId } = useWeb3React()

  const state = useSelector<AppState>(state => state.transactions)

  return state[chainId] ?? {}
}

export function useIsTransactionPending(transactionHash?: string): boolean {
  const transactions = useAllTransactions()

  if (!transactionHash || !transactions[transactionHash]) return false

  return !transactions[transactionHash].receipt
}

// returns whether a token has a pending approval transaction
export function useHasPendingApproval(tokenAddress: string): boolean {
  const allTransactions = useAllTransactions()
  return Object.keys(allTransactions).some(hash => {
    if (allTransactions[hash]?.receipt) {
      return false
    } else {
      return allTransactions[hash]?.approvalOfToken === tokenAddress
    }
  })
}
