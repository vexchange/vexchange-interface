import { useMemo } from 'react'
import { Token, TokenAmount, Pair, Trade, ChainId, WVET, Route, TradeType, Percent } from 'vexchange-sdk'
import useSWR from 'swr'
import { find } from 'lodash'
import { useWeb3React } from '../hooks'

import IUniswapV1Factory from '../constants/abis/v1_factory.json'
import { V1_FACTORY_ADDRESS } from '../constants'
import { SWRKeys } from '.'
import { useETHBalances, useTokenBalances } from '../state/wallet/hooks'
import { V1_FACTORY_ABI, V1_FACTORY_ADDRESSES } from '../constants/v1'

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

export function useV1FactoryContract(method) {
  const { chainId } = useWeb3React()
  return useContract(V1_FACTORY_ADDRESSES[chainId as ChainId], V1_FACTORY_ABI, method)
}

function getV1PairAddress(method): (tokenAddress: string) => Promise<string> {
  return async (tokenAddress: string): Promise<string> => {
    return method.call(tokenAddress).then(({ decoded }) => decoded['0'])
  }
}

function useV1PairAddress(tokenAddress: string) {
  const { chainId } = useWeb3React()

  const method = useContract(V1_FACTORY_ADDRESS, IUniswapV1Factory, 'getExchange')

  const shouldFetch = chainId === ChainId.MAINNET && typeof tokenAddress === 'string' && !!method
  const { data } = useSWR(shouldFetch ? [tokenAddress, SWRKeys.V1PairAddress] : null, getV1PairAddress(method), {
    // don't need to update this data
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  })

  return data
}

function useMockV1Pair(token?: Token) {
  const isWETH = token?.equals(WVET[token?.chainId])

  // will only return an address on mainnet, and not for WVET
  const v1PairAddress = useV1PairAddress(isWETH ? undefined : token?.address)
  const tokenBalance = useTokenBalances(v1PairAddress, [token])[token?.address]
  const ETHBalance = useETHBalances([v1PairAddress])[v1PairAddress]

  return tokenBalance && ETHBalance
    ? new Pair(tokenBalance, new TokenAmount(WVET[token?.chainId], ETHBalance.toString()))
    : undefined
}

export function useV1TradeLinkIfBetter(
  isExactIn: boolean,
  inputToken: Token,
  outputToken: Token,
  exactAmount: TokenAmount,
  v2Trade: Trade,
  minimumDelta: Percent = new Percent('0')
): string {
  const { chainId } = useWeb3React()

  const input = inputToken
  const output = outputToken
  const mainnet = chainId === ChainId.MAINNET

  // get the mock v1 pairs
  const inputPair = useMockV1Pair(input)
  const outputPair = useMockV1Pair(output)

  const inputIsWETH = mainnet && input?.equals(WVET[ChainId.MAINNET])
  const outputIsWETH = mainnet && output?.equals(WVET[ChainId.MAINNET])

  // construct a direct or through ETH v1 route
  let pairs: Pair[]
  if (inputIsWETH && outputPair) {
    pairs = [outputPair]
  } else if (outputIsWETH && inputPair) {
    pairs = [inputPair]
  }
  // if neither are WVET, it's token-to-token (if they both exist)
  else if (inputPair && outputPair) {
    pairs = [inputPair, outputPair]
  }

  const route = pairs && new Route(pairs, input)
  const v1Trade =
    route && exactAmount
      ? new Trade(route, exactAmount, isExactIn ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT)
      : undefined

  let v1HasBetterTrade = false
  if (v1Trade) {
    if (isExactIn) {
      // discount the v1 output amount by minimumDelta
      const discountedV1Output = v1Trade?.outputAmount.multiply(new Percent('1').subtract(minimumDelta))
      // check if the discounted v1 amount is still greater than v2, short-circuiting if no v2 trade exists
      v1HasBetterTrade = !!!v2Trade || discountedV1Output.greaterThan(v2Trade.outputAmount)
    } else {
      // inflate the v1 amount by minimumDelta
      const inflatedV1Input = v1Trade?.inputAmount.multiply(new Percent('1').add(minimumDelta))
      // check if the inflated v1 amount is still less than v2, short-circuiting if no v2 trade exists
      v1HasBetterTrade = !!!v2Trade || inflatedV1Input.lessThan(v2Trade.inputAmount)
    }
  }

  return v1HasBetterTrade
    ? `https://vexchange.io/swap?inputCurrency=${inputIsWETH ? 'VET' : input.address}&outputCurrency=${
        outputIsWETH ? 'VET' : output.address
      }`
    : undefined
}
