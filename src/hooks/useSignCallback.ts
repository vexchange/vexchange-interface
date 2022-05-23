import { ROUTER_ADDRESS } from '../constants'

import { useCallback } from 'react'
import { useWeb3React } from './index'

export function useSignCallback() {
  const { library } = useWeb3React()

  const signCallback = useCallback(async (abi, value, args, comment, userFreeSwapInfo) => {
    let method, clause, tx

    if (window.connex) {
      const signingService = window.connex.vendor.sign("tx")

      method = window.connex.thor.account(ROUTER_ADDRESS).method(abi)

      method.value(value ? value.toString() : 0)
      clause = method.asClause(...args)

      signingService.comment(comment)
      tx = signingService.request([clause])

      console.log('Using Connex 1');
    } else {
      method = library.thor.account(ROUTER_ADDRESS).method(abi)
      clause = method.asClause(...args)

      tx = library.vendor.sign('tx', [
        {
          ...clause,
          comment,
          value: value ? value.toString() : 0,
        }
      ]).request()

      const isEligibleForFreeSwap = userFreeSwapInfo?.remainingFreeSwaps > 0 && userFreeSwapInfo?.hasNFT
      if (isEligibleForFreeSwap) {
        tx.delegate(process.env.REACT_APP_VIP191_API_URL)
      }

      console.log('Using Connex 2');
    }

    return tx
  }, [])

  return [signCallback]
}

