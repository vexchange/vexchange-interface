import { useMemo } from 'react'
import { Token, TokenAmount, Pair } from 'vexchange-sdk'
import useSWR from 'swr'
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

function getReserves(method, tokenA: Token, tokenB: Token): () => Promise<Pair | null> {
  return async (): Promise<Pair | null> =>
    method
      .call()
      .then(({ decoded: { reserve0, reserve1 } }) => {
        const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
        return new Pair(new TokenAmount(token0, reserve0.toString()), new TokenAmount(token1, reserve1.toString()))
      })
      .catch(() => {
        return null
      })
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
    getReserves(method, tokenA, tokenB)
  )

  useKeepSWRDataLiveAsBlocksArrive(mutate)

  return data
}
