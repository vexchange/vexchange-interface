import { getAddress } from '@ethersproject/address'
import { JSBI, Token, TokenAmount } from 'vexchange-sdk'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAllTokens } from '../../hooks/Tokens'
import { useWeb3React } from '../../hooks'
import { isAddress } from '../../utils'
import { AppDispatch, AppState } from '../index'
import {
  startListeningForBalance,
  startListeningForTokenBalances,
  stopListeningForBalance,
  stopListeningForTokenBalances,
  TokenBalanceListenerKey
} from './actions'
import { balanceKey } from './reducer'
import { DUMMY_VET } from '../../constants'

/**
 * Returns a map of the given addresses to their eventually consistent ETH balances.
 */
export function useETHBalances(uncheckedAddresses?: (string | undefined)[]): { [address: string]: JSBI | undefined } {
  const dispatch = useDispatch<AppDispatch>()
  const { chainId } = useWeb3React()

  const addresses: string[] = useMemo(
    () =>
      uncheckedAddresses
        ? uncheckedAddresses
            .filter(isAddress)
            .map(getAddress)
            .sort()
        : [],
    [uncheckedAddresses]
  )

  // add the listeners on mount, remove them on dismount
  useEffect(() => {
    if (addresses.length === 0) return

    dispatch(startListeningForBalance({ addresses }))
    return () => dispatch(stopListeningForBalance({ addresses }))
  }, [addresses, dispatch])

  const rawBalanceMap = useSelector<AppState>(({ wallet: { balances } }) => balances)

  return useMemo(() => {
    return addresses.reduce<{ [address: string]: JSBI }>((map, address) => {
      const key = balanceKey({ address, chainId })
      const { value } = rawBalanceMap[key] ?? {}
      if (value) {
        map[address] = JSBI.BigInt(value)
      }
      return map
    }, {})
  }, [chainId, addresses, rawBalanceMap])
}

/**
 * Returns a map of token addresses to their eventually consistent token balances for a single account.
 */
export function useTokenBalances(
  address?: string,
  tokens?: (Token | undefined)[]
): { [tokenAddress: string]: TokenAmount | undefined } {
  const dispatch = useDispatch<AppDispatch>()
  const { chainId } = useWeb3React()

  const validTokens: Token[] = useMemo(
    () => tokens?.filter((t?: Token): t is Token => isAddress(t?.address) !== false) ?? [],
    [tokens]
  )
  // used so that we do a deep comparison in `useEffect`
  const serializedCombos: string = useMemo(() => {
    return JSON.stringify(
      !address || validTokens.length === 0
        ? []
        : validTokens
            .map(t => t.address)
            .sort()
            .map(tokenAddress => ({ address, tokenAddress }))
    )
  }, [address, validTokens])

  // keep the listeners up to date
  useEffect(() => {
    const combos: TokenBalanceListenerKey[] = JSON.parse(serializedCombos)
    if (combos.length === 0) return

    dispatch(startListeningForTokenBalances(combos))
    return () => {
      dispatch(stopListeningForTokenBalances(combos))
    }
  }, [address, serializedCombos, dispatch])

  const rawBalanceMap = useSelector<AppState>(({ wallet: { balances } }) => balances)

  return useMemo(() => {
    if (!address || validTokens.length === 0) {
      return {}
    }
    return (
      validTokens.reduce<{ [address: string]: TokenAmount }>((map, token) => {
        const key = balanceKey({ address, chainId, tokenAddress: token.address })
        const { value } = rawBalanceMap[key] ?? {}
        if (value) {
          map[token.address] = new TokenAmount(token, JSBI.BigInt(value))
        }
        return map
      }, {}) ?? {}
    )
  }, [address, validTokens, chainId, rawBalanceMap])
}

// contains the hacky logic to treat the WETH token input as if it's ETH to
// maintain compatibility until we handle them separately.
export function useTokenBalancesTreatWETHAsETH(
  address?: string,
  tokens?: (Token | undefined)[]
): { [tokenAddress: string]: TokenAmount | undefined } {
  const { chainId } = useWeb3React()
  const { tokensWithoutWETH, includesWETH } = useMemo(() => {
    if (!tokens || tokens.length === 0) {
      return { includesWETH: false, tokensWithoutWETH: [] }
    }
    let includesWETH = false
    const tokensWithoutWETH = tokens.filter(t => {
      const isWETH = t?.equals(DUMMY_VET[chainId]) ?? false
      if (isWETH) includesWETH = true
      return !isWETH
    })
    return { includesWETH, tokensWithoutWETH }
  }, [tokens, chainId])

  const balancesWithoutWETH = useTokenBalances(address, tokensWithoutWETH)
  const ETHBalance = useETHBalances(includesWETH ? [address] : [])

  return useMemo(() => {
    if (includesWETH) {
      const weth = DUMMY_VET[chainId]
      const ethBalance = ETHBalance[address]
      return {
        ...balancesWithoutWETH,
        ...(ethBalance && weth ? { [weth.address]: new TokenAmount(weth, ethBalance) } : null)
      }
    } else {
      return balancesWithoutWETH
    }
  }, [balancesWithoutWETH, ETHBalance, includesWETH, address, chainId])
}

// get the balance for a single token/account combo
export function useTokenBalance(account?: string, token?: Token): TokenAmount | undefined {
  return useTokenBalances(account, [token])?.[token?.address]
}

// mimics the behavior of useAddressBalance
export function useTokenBalanceTreatingWETHasETH(account?: string, token?: Token): TokenAmount | undefined {
  const balances = useTokenBalancesTreatWETHAsETH(account, [token])
  return token && token.address && balances?.[token.address]
}

// mimics useAllBalances
export function useAllTokenBalancesTreatingWETHasETH(): {
  [account: string]: { [tokenAddress: string]: TokenAmount | undefined }
} {
  const { account } = useWeb3React()
  const allTokens = useAllTokens()
  const allTokensArray = useMemo(() => Object.values(allTokens ?? {}), [allTokens])
  const balances = useTokenBalancesTreatWETHAsETH(account, allTokensArray)
  return account ? { [account]: balances } : {}
}
