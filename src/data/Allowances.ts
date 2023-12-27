import { useMemo } from 'react'
import { Token, TokenAmount } from 'vexchange-sdk/dist'
import useSWR from 'swr'
import { find } from 'lodash'
import { SWRKeys, useKeepSWRDataLiveAsBlocksArrive } from '.'

import ERC20_ABI from '../constants/abis/erc20.json'
import { useWeb3React } from '../hooks'

// returns null on errors
export function useTokenContract(tokenAddress: string) {
  const { library } = useWeb3React()
  const abi = find(ERC20_ABI, { name: 'allowance' })

  return useMemo(() => {
    try {
      return library.thor.account(tokenAddress).method(abi)
    } catch {
      return null
    }
  }, [tokenAddress, abi, library.thor])
}

function getTokenAllowance(method, token): (owner: string, spender: string) => Promise<TokenAmount> {
  return async (owner: string, spender: string): Promise<TokenAmount> =>
    method.call(owner, spender).then(data => {
      return new TokenAmount(token, data.decoded[0].toString())
    })
}

export function useTokenAllowance(token?: Token, owner?: string, spender?: string): TokenAmount {
  const method = useTokenContract(token?.address)
  const shouldFetch = !!method && typeof owner === 'string' && typeof spender === 'string'

  const { data, mutate } = useSWR(
    shouldFetch ? [owner, spender, token.address, token.chainId, SWRKeys.Allowances] : null,
    getTokenAllowance(method, token)
  )

  useKeepSWRDataLiveAsBlocksArrive(mutate)

  return data
}
