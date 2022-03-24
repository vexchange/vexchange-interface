import { useMemo } from 'react'
import { WVET, Token, TokenAmount, Trade, ChainId, Pair } from 'vexchange-sdk'
import { useWeb3React } from './index'
import { usePair } from '../data/Reserves'
import { DUMMY_VET } from '../constants'

const VTHO = new Token(ChainId.MAINNET, '0x0000000000000000000000000000456E65726779', 18, 'VTHO', 'VeThor')

function useAllCommonPairs(tokenA?: Token, tokenB?: Token): Pair[] {
  const { chainId } = useWeb3React()

  // check for direct pair between tokens
  const pairBetween = usePair(tokenA, tokenB)

  // get token<->WVET pairs
  const aToETH = usePair(tokenA, WVET[chainId])
  const bToETH = usePair(tokenB, WVET[chainId])

  // get token<->VTHO pairs
  const aToVTHO = usePair(tokenA, chainId === ChainId.MAINNET ? VTHO : undefined)
  const bToVTHO = usePair(tokenB, chainId === ChainId.MAINNET ? VTHO : undefined)

  // get connecting pairs
  const VTHOToETH = usePair(chainId === ChainId.MAINNET ? VTHO : undefined, WVET[chainId])

  // only pass along valid pairs, non-duplicated pairs
  return useMemo(
    () =>
      [pairBetween, aToETH, bToETH, aToVTHO, bToVTHO, VTHOToETH]
        // filter out invalid pairs
        .filter(p => !!p)
        // filter out duplicated pairs
        .filter(
          (p, i, pairs) => i === pairs.findIndex(pair => pair?.liquidityToken.address === p.liquidityToken.address)
        ),
    [pairBetween, aToETH, bToETH, aToVTHO, bToVTHO, VTHOToETH]
  )
}

/**
 * Returns the best trade for the exact amount of tokens in to the given token out
 */
export function useTradeExactIn(amountIn?: TokenAmount, tokenOut?: Token): Trade | null {
  const inputToken = amountIn?.token
  const outputToken = tokenOut

  const tokenOutVet = tokenOut?.equals(DUMMY_VET[1])
  const tokenInVet = inputToken?.equals(DUMMY_VET[1])

  const allowedPairs = useAllCommonPairs(inputToken, outputToken)

  return useMemo(() => {
    if (amountIn && tokenOut && allowedPairs.length > 0) {
      if (tokenInVet && !tokenOutVet) {
        amountIn.token = WVET[1]
        const trade =
          Trade.bestTradeExactIn(allowedPairs, amountIn, tokenOut, {
            maxHops: 1,
            maxNumResults: 1
          })[0] ?? null
        if (trade) {
          trade.inputAmount.token = DUMMY_VET[1]
          return trade
        } else {
          return null
        }
      } else if (!tokenInVet && tokenOutVet) {
        tokenOut = WVET[1]
        const trade =
          Trade.bestTradeExactIn(allowedPairs, amountIn, tokenOut, {
            maxHops: 1,
            maxNumResults: 1
          })[0] ?? null
        if (trade) {
          return trade
        } else {
          return null
        }
      } else {
        return (
          Trade.bestTradeExactIn(allowedPairs, amountIn, tokenOut, {
            maxHops: 1,
            maxNumResults: 1
          })[0] ?? null
        )
      }
    }
    return null
  }, [allowedPairs, amountIn, tokenOut])
}

/**
 * Returns the best trade for the token in to the exact amount of token out
 */
export function useTradeExactOut(tokenIn?: Token, amountOut?: TokenAmount): Trade | null {
  const inputToken = tokenIn
  const outputToken = amountOut?.token

  const allowedPairs = useAllCommonPairs(inputToken, outputToken)
  // const tokenOutVet = outputToken?.equals(DUMMY_VET[1])
  // const tokenInVet = inputToken?.equals(DUMMY_VET[1])

  return useMemo(() => {
    if (tokenIn && amountOut && allowedPairs.length > 0) {
      return (
        Trade.bestTradeExactOut(allowedPairs, tokenIn, amountOut, {
          maxHops: 1,
          maxNumResults: 1
        })[0] ?? null
      )
    }
    return null
  }, [allowedPairs, tokenIn, amountOut])
}
