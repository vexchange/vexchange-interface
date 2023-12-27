import { useMemo } from 'react'
import { Fetcher, Token, Pair } from 'vexchange-sdk/dist'
import useSWR from 'swr'
import { getLibrary } from '../index'
import { find } from 'lodash'
import { abi as IVexchangeV2PairABI } from '../constants/abis/IVexchangeV2Pair.json'

import { SWRKeys, useKeepSWRDataLiveAsBlocksArrive } from '.'

import { useWeb3React } from '../hooks'

// returns null on errors
export function useContract(address) {
  const { library } = useWeb3React()
  const abi = find(IVexchangeV2PairABI, { name: 'getReserves' })

  return useMemo(() => {
    try {
      return library.thor.account(address).method(abi)
    } catch {
      return null
    }
  }, [address, abi, library.thor])
}

function getPair(tokenA: Token, tokenB: Token): () => Promise<Pair | null> {
  const connex = getLibrary()

  return async (): Promise<Pair | null> => {
    try {
      return await Fetcher.fetchPairData(tokenA, tokenB, connex)
    } catch {
      return null
    }
  }
}

/*
 * if loading, return undefined
 * if no pair created yet, return null
 * if pair already created (even if 0 reserves), return pair
 */
export function usePair(tokenA?: Token, tokenB?: Token): undefined | Pair | null {
  const pairAddress = !!tokenA && !!tokenB && !tokenA.equals(tokenB) ? Pair.getAddress(tokenA, tokenB) : undefined
  const method = useContract(pairAddress)

  const shouldFetch = !!method

  const { data, mutate } = useSWR(
    shouldFetch ? [pairAddress, tokenA.chainId, SWRKeys.Reserves] : null,
    getPair(tokenA, tokenB)
  )

  useKeepSWRDataLiveAsBlocksArrive(mutate)

  return data
}
