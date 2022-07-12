import { useMemo } from 'react'
import { Token, TokenAmount } from 'vexchange-sdk'
import useSWR from 'swr'
import { find } from 'lodash'
import ERC20_ABI from '../constants/abis/erc20.json'

import { SWRKeys, useKeepSWRDataLiveAsBlocksArrive } from '.'
import { useWeb3React } from '../hooks'

// returns null on errors
export function useContract(address) {
  const { library } = useWeb3React()
  const abi = find(ERC20_ABI, { name: 'totalSupply' })

  return useMemo(() => {
    try {
      return library.thor.account(address).method(abi)
    } catch {
      return null
    }
  }, [address, abi, library.thor])
}

function getTotalSupply(method, token): () => Promise<TokenAmount> {
  return async (): Promise<TokenAmount> =>
    method.call().then(data => {
      return new TokenAmount(token, data.decoded[0].toString())
    })
}

export function useTotalSupply(token?: Token): TokenAmount {
  const method = useContract(token?.address)
  const shouldFetch = !!method

  const { data, mutate } = useSWR(
    shouldFetch ? [token.address, token.chainId, SWRKeys.TotalSupply] : null,
    getTotalSupply(method, token)
  )

  useKeepSWRDataLiveAsBlocksArrive(mutate)

  return data
}
