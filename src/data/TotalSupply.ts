import { useEffect, useState } from 'react'
import { Token, TokenAmount } from '@uniswap/sdk'
import { find } from 'lodash'
import { abi as IERC20ABI } from '@uniswap/v2-core/build/IERC20.json'

import { useWeb3React } from '../hooks'

export function useTotalSupply(token?: Token): TokenAmount {
  const [amount, setAmount] = useState<TokenAmount>()
  const { library } = useWeb3React()
  const abi = find(IERC20ABI, { name: 'totalSupply' })

  useEffect(() => {
    const getTotalSupply = async () => {
      const method = library.thor.account(token.address).method(abi)
      const { decoded: { 0: totalSupply } } = await method.call()

      const tokenAmount = new TokenAmount(token, totalSupply.toString())

      setAmount(tokenAmount)
    }

    if (token?.address) {
      getTotalSupply()
    }
  }, [token])

  return amount
}
