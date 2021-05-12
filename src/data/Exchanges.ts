import { useMemo } from 'react'
import useSWR from 'swr'
import { find } from 'lodash'

import { isAddress } from '../utils'
import { V1_EXCHANGE_ABI } from '../constants/v1'
import { SWRKeys, useKeepSWRDataLiveAsBlocksArrive } from '.'
import { useWeb3React } from '../hooks'

function useContract(address, abi, method) {
  const { library } = useWeb3React()
  const methodABI = find(abi, { name: method })

  return useMemo(() => {
    if (!address || !abi || !library) return null
    try {
      return library.thor.account(address).method(methodABI)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, abi, library, methodABI])
}

function useV1ExchangeContract(address: string, method) {
  return useContract(address, V1_EXCHANGE_ABI, method)
}

function getTokenAddress(method): () => Promise<string | null> {
  return async (): Promise<string | null> =>
    method
      .call()
      .then(({ decoded }) => decoded['0'])
      .catch(() => {
        return null
      })
}

/*
 * if loading, return undefined
 * if no pair created yet, return null
 * if pair already created (even if 0 reserves), return pair
 */
export function useTokenAddress(address) {
  const validated = isAddress(address)
  const method = useV1ExchangeContract(validated ? validated : undefined, 'tokenAddress')

  const shouldFetch = !!method

  const { data, mutate } = useSWR(shouldFetch ? [address, SWRKeys.TokenAddress] : null, getTokenAddress(method))

  useKeepSWRDataLiveAsBlocksArrive(mutate)

  return data
}
