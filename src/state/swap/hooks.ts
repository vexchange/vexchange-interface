import { parseUnits } from '@ethersproject/units'
import { JSBI, Token, TokenAmount, Trade, ChainId } from 'vexchange-sdk'
import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useWeb3React } from '../../hooks'
import { useTokenByAddressAndAutomaticallyAdd } from '../../hooks/Tokens'
import { useTradeExactIn, useTradeExactOut } from '../../hooks/Trades'
import { AppDispatch, AppState } from '../index'
import { useTokenBalancesTreatWETHAsETH, useTokenBalances } from '../wallet/hooks'
import { Field, selectToken, setDefaultsFromURL, switchTokens, typeInput } from './actions'

export function useSwapState(): AppState['swap'] {
  return useSelector<AppState, AppState['swap']>(state => state.swap)
}

export function useSwapActionHandlers(): {
  onTokenSelection: (field: Field, address: string) => void
  onSwitchTokens: () => void
  onUserInput: (field: Field, typedValue: string) => void
} {
  const dispatch = useDispatch<AppDispatch>()
  const onTokenSelection = useCallback(
    (field: Field, address: string) => {
      dispatch(
        selectToken({
          field,
          address
        })
      )
    },
    [dispatch]
  )

  const onSwapTokens = useCallback(() => {
    dispatch(switchTokens())
  }, [dispatch])

  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      dispatch(typeInput({ field, typedValue }))
    },
    [dispatch]
  )

  return {
    onSwitchTokens: onSwapTokens,
    onTokenSelection,
    onUserInput
  }
}

// try to parse a user entered amount for a given token
function tryParseAmount(value?: string, token?: Token): TokenAmount | undefined {
  if (!value || !token) return
  try {
    const typedValueParsed = parseUnits(value, token.decimals).toString()
    if (typedValueParsed !== '0') return new TokenAmount(token, JSBI.BigInt(typedValueParsed))
  } catch (error) {
    // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    console.debug(`Failed to parse input amount: "${value}"`, error)
  }
}

const VTHO = new Token(ChainId.MAINNET, '0x0000000000000000000000000000456E65726779', 18, 'VTHO', 'VeThor')

// from the current swap inputs, compute the best trade and return it.
export function useDerivedSwapInfo(): {
  tokens: { [field in Field]?: Token }
  tokenBalances: { [field in Field]?: TokenAmount }
  parsedAmounts: { [field in Field]?: TokenAmount }
  bestTrade: Trade | null
  error?: string
} {
  const { account } = useWeb3React()
  const vthoBalance = useTokenBalances(account, [VTHO]) ?? {}

  const {
    independentField,
    typedValue,
    [Field.INPUT]: { address: tokenInAddress },
    [Field.OUTPUT]: { address: tokenOutAddress }
  } = useSwapState()

  const tokenIn = useTokenByAddressAndAutomaticallyAdd(tokenInAddress)
  const tokenOut = useTokenByAddressAndAutomaticallyAdd(tokenOutAddress)

  const relevantTokenBalances = useTokenBalancesTreatWETHAsETH(account, [tokenIn, tokenOut])

  const isExactIn: boolean = independentField === Field.INPUT
  const amount = tryParseAmount(typedValue, isExactIn ? tokenIn : tokenOut)

  const bestTradeExactIn = useTradeExactIn(isExactIn ? amount : null, tokenOut)
  const bestTradeExactOut = useTradeExactOut(tokenIn, !isExactIn ? amount : null)

  const bestTrade = isExactIn ? bestTradeExactIn : bestTradeExactOut

  const parsedAmounts = {
    [Field.INPUT]: isExactIn ? amount : bestTrade?.inputAmount,
    [Field.OUTPUT]: isExactIn ? bestTrade?.outputAmount : amount
  }

  const tokenBalances = {
    [Field.INPUT]: relevantTokenBalances?.[tokenIn?.address],
    [Field.OUTPUT]: relevantTokenBalances?.[tokenOut?.address]
  }

  const tokens = {
    [Field.INPUT]: tokenIn,
    [Field.OUTPUT]: tokenOut
  }

  let error: string | undefined
  if (!account) {
    error = 'Connect Wallet'
  }

  if (!parsedAmounts[Field.INPUT]) {
    error = error ?? 'Enter an amount'
  }

  if (!parsedAmounts[Field.OUTPUT]) {
    error = error ?? 'Enter an amount'
  }

  if (
    tokenBalances[Field.INPUT] &&
    parsedAmounts[Field.INPUT] &&
    tokenBalances[Field.INPUT].lessThan(parsedAmounts[Field.INPUT])
  ) {
    error = 'Insufficient ' + tokens[Field.INPUT]?.symbol + ' balance'
  }

  if (vthoBalance[Object.keys(vthoBalance)[0]]?.equalTo(JSBI.BigInt(0))) {
    error = 'Insufficient VTHO'
  }

  return {
    tokens,
    tokenBalances,
    parsedAmounts,
    bestTrade,
    error
  }
}

// updates the swap state to use the defaults for a given network whenever the query
// string updates
export function useDefaultsFromURL(search?: string) {
  const { chainId } = useWeb3React()
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    dispatch(setDefaultsFromURL({ chainId, queryString: search }))
  }, [dispatch, search, chainId])
}
