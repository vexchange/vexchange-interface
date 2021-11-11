import { TransactionResponse } from '@ethersproject/abstract-provider'
import { ChainId, Fraction, JSBI, Percent, Token, TokenAmount, WVET } from 'vexchange-sdk'
import React, { useCallback, useMemo, useState } from 'react'
import { ArrowLeft } from 'react-feather'
import { find } from 'lodash'
import { Redirect, RouteComponentProps } from 'react-router'
import { ButtonConfirmed } from '../../components/Button'
import { PinkCard, YellowCard, LightCard } from '../../components/Card'
import { AutoColumn } from '../../components/Column'
import QuestionHelper from '../../components/QuestionHelper'
import { AutoRow, RowBetween } from '../../components/Row'
import { DEFAULT_DEADLINE_FROM_NOW, INITIAL_ALLOWED_SLIPPAGE } from '../../constants'
import { usePair } from '../../data/Reserves'
import { useTotalSupply } from '../../data/TotalSupply'
import { useWeb3React } from '../../hooks'
import { useTokenByAddressAndAutomaticallyAdd } from '../../hooks/Tokens'
import { Approval, useApproveCallback } from '../../hooks/useApproveCallback'
import { useIsTransactionPending, useTransactionAdder } from '../../state/transactions/hooks'
import { useETHBalances, useTokenBalance } from '../../state/wallet/hooks'
import { TYPE } from '../../theme'
import { isAddress } from '../../utils'
import { BodyWrapper } from '../AppBody'
import { EmptyState } from './EmptyState'
import TokenLogo from '../../components/TokenLogo'
import { FormattedPoolTokenAmount } from './index'
import { useTokenAddress } from '../../data/TokenAddress'
import { MIGRATOR_ABI, MIGRATOR_ADDRESS } from '../../constants/abis/migrator'

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

export function useV2MigratorContract() {
  return useContract(MIGRATOR_ADDRESS, MIGRATOR_ABI, 'migrate')
}

const WEI_DENOM = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18))
const ZERO = JSBI.BigInt(0)
const ONE = JSBI.BigInt(1)
const ZERO_FRACTION = new Fraction(ZERO, ONE)
const ALLOWED_OUTPUT_MIN_PERCENT = new Percent(JSBI.BigInt(10000 - INITIAL_ALLOWED_SLIPPAGE), JSBI.BigInt(10000))

function V1PairMigration({ liquidityTokenAmount, token }: { liquidityTokenAmount: TokenAmount; token: Token }) {
  const { account, chainId, library } = useWeb3React()
  const totalSupply = useTotalSupply(liquidityTokenAmount.token)
  const exchangeETHBalance = useETHBalances([liquidityTokenAmount.token.address])?.[liquidityTokenAmount.token.address]
  const exchangeTokenBalance = useTokenBalance(liquidityTokenAmount.token.address, token)

  const v2Pair = usePair(WVET[chainId as ChainId], token)
  const isFirstLiquidityProvider: boolean = v2Pair === null

  const v2SpotPrice = v2Pair?.reserveOf(token)?.divide(v2Pair?.reserveOf(WVET[chainId as ChainId]))

  const [confirmingMigration, setConfirmingMigration] = useState<boolean>(false)
  const [pendingMigrationHash, setPendingMigrationHash] = useState<string | null>(null)
  const [isSuccessfullyMigrated, setIsSuccessfullyMigrated] = useState<boolean>(false)

  const shareFraction: Fraction = totalSupply ? new Percent(liquidityTokenAmount.raw, totalSupply.raw) : ZERO_FRACTION

  const ethWorth: Fraction = exchangeETHBalance
    ? new Fraction(shareFraction.multiply(exchangeETHBalance).quotient, WEI_DENOM)
    : ZERO_FRACTION

  const tokenWorth: TokenAmount = exchangeTokenBalance
    ? new TokenAmount(token, shareFraction.multiply(exchangeTokenBalance.raw).quotient)
    : new TokenAmount(token, ZERO)

  const [approval, approve] = useApproveCallback(liquidityTokenAmount, MIGRATOR_ADDRESS)

  const v1SpotPrice =
    exchangeTokenBalance && exchangeETHBalance
      ? exchangeTokenBalance.divide(new Fraction(exchangeETHBalance, WEI_DENOM))
      : null

  const priceDifferenceFraction: Fraction | undefined =
    v1SpotPrice && v2SpotPrice
      ? v1SpotPrice
          .divide(v2SpotPrice)
          .multiply('100')
          .subtract('100')
      : undefined

  const priceDifferenceAbs: Fraction | undefined = priceDifferenceFraction?.lessThan(ZERO)
    ? priceDifferenceFraction?.multiply('-1')
    : priceDifferenceFraction

  const minAmountETH: JSBI | undefined =
    v2SpotPrice && tokenWorth
      ? tokenWorth
          .divide(v2SpotPrice)
          .multiply(WEI_DENOM)
          .multiply(ALLOWED_OUTPUT_MIN_PERCENT).quotient
      : ethWorth?.numerator

  const minAmountToken: JSBI | undefined =
    v2SpotPrice && ethWorth
      ? ethWorth
          .multiply(v2SpotPrice)
          .multiply(JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(token.decimals)))
          .multiply(ALLOWED_OUTPUT_MIN_PERCENT).quotient
      : tokenWorth?.numerator

  const addTransaction = useTransactionAdder()
  const isMigrationPending = useIsTransactionPending(pendingMigrationHash)

  const method = useV2MigratorContract()
  const clause = method.asClause(
    token.address,
    minAmountToken.toString(),
    minAmountETH.toString(),
    account,
    Math.floor(new Date().getTime() / 1000) + DEFAULT_DEADLINE_FROM_NOW
  )

  const migrate = useCallback(() => {
    if (!minAmountToken || !minAmountETH) return

    setConfirmingMigration(true)

    library.vendor
      .sign('tx', [{ ...clause }])
      .comment(`Migrate ${token?.symbol}`)
      .request()
      .then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: `Migrate ${token.symbol} liquidity to V2`
        })
        setPendingMigrationHash(response.hash)
        setIsSuccessfullyMigrated(true)
      })
      .catch(() => {
        setConfirmingMigration(false)
      })
  }, [addTransaction, clause, library.vendor, minAmountETH, minAmountToken, token])

  const noLiquidityTokens = liquidityTokenAmount && liquidityTokenAmount.equalTo(ZERO)

  const largePriceDifference = Boolean(priceDifferenceAbs && !priceDifferenceAbs.lessThan(JSBI.BigInt(5)))

  return (
    <AutoColumn gap="20px">
      {!isFirstLiquidityProvider ? (
        largePriceDifference ? (
          <YellowCard>
            <TYPE.body style={{ marginBottom: 8, fontWeight: 400 }}>
              It is best to deposit liquidity into Vexchange V2 at a price you believe is correct. If you believe the
              price is incorrect, you can either make a swap to move the price or wait for someone else to do so.
            </TYPE.body>
            <AutoColumn gap="8px">
              <RowBetween>
                <TYPE.body>V1 Price:</TYPE.body>
                <TYPE.black>
                  {v1SpotPrice?.toSignificant(6)} {token.symbol}/VET
                </TYPE.black>
              </RowBetween>
              <RowBetween>
                <TYPE.body>V2 Price:</TYPE.body>
                <TYPE.black>
                  {v2SpotPrice?.toSignificant(6)} {token.symbol}/VET
                </TYPE.black>
              </RowBetween>
              <RowBetween>
                <div>Price Difference:</div>
                <div>{priceDifferenceAbs.toSignificant(4)}%</div>
              </RowBetween>
            </AutoColumn>
          </YellowCard>
        ) : null
      ) : (
        <PinkCard>
          <AutoColumn gap="10px">
            <div>
              You are the first liquidity provider for this pair on Vexchange V2. Your liquidity will be migrated at the
              current V1 price. Your transaction cost also includes the gas to create the pool.
            </div>
            <div>V1 Price</div>
            <AutoColumn>
              <div>
                {v1SpotPrice?.invert()?.toSignificant(6)} VET/{token.symbol}
              </div>
              <div>
                {v1SpotPrice?.toSignificant(6)} {token.symbol}/VET
              </div>
            </AutoColumn>
          </AutoColumn>
        </PinkCard>
      )}
      <LightCard>
        <AutoRow style={{ justifyContent: 'flex-start', width: 'fit-content' }}>
          <TokenLogo size="24px" address={token.address} />{' '}
          <div style={{ marginLeft: '.75rem' }}>
            <TYPE.mediumHeader>
              {<FormattedPoolTokenAmount tokenAmount={liquidityTokenAmount} />} {token.symbol} Pool Tokens
            </TYPE.mediumHeader>
          </div>
        </AutoRow>
        <div style={{ display: 'flex', marginTop: '1rem' }}>
          <AutoColumn gap="12px" style={{ flex: '1', marginRight: 12 }}>
            <ButtonConfirmed
              confirmed={approval === Approval.APPROVED}
              disabled={approval !== Approval.NOT_APPROVED}
              onClick={approve}
            >
              {approval === Approval.PENDING ? 'Approving...' : approval === Approval.APPROVED ? 'Unlocked' : 'Unlock'}
            </ButtonConfirmed>
          </AutoColumn>
          <AutoColumn gap="12px" style={{ flex: '1' }}>
            <ButtonConfirmed
              confirmed={isSuccessfullyMigrated}
              disabled={
                isSuccessfullyMigrated ||
                noLiquidityTokens ||
                isMigrationPending ||
                approval !== Approval.APPROVED ||
                confirmingMigration
              }
              onClick={migrate}
            >
              {isSuccessfullyMigrated ? 'Success' : isMigrationPending ? 'Migrating...' : 'Migrate'}
            </ButtonConfirmed>
          </AutoColumn>
        </div>
      </LightCard>
      <TYPE.darkGray style={{ textAlign: 'center' }}>
        {'Your ' + token.symbol + ' liquidity will become Vexchange V2 ' + token.symbol + '/VET liquidity.'}
      </TYPE.darkGray>
    </AutoColumn>
  )
}

export default function MigrateV1Exchange({
  history,
  match: {
    params: { address }
  }
}: RouteComponentProps<{ address: string }>) {
  const validated = isAddress(address)
  const { account, chainId } = useWeb3React()

  const tokenAddress = useTokenAddress(validated ? validated : undefined)

  const token = useTokenByAddressAndAutomaticallyAdd(tokenAddress)

  const liquidityToken: Token | undefined = useMemo(
    () => (validated && token ? new Token(chainId, validated, 18, `VEX-V1-${token.symbol}`) : undefined),
    [chainId, token, validated]
  )

  const userLiquidityBalance = useTokenBalance(account, liquidityToken)

  const handleBack = useCallback(() => {
    history.push('/migrate/v1')
  }, [history])

  if (!validated) {
    console.error('Invalid address in path', address)
    return <Redirect to="/migrate/v1" />
  }

  if (!account) {
    return (
      <BodyWrapper style={{ textAlign: 'center' }}>
        <TYPE.largeHeader>You must connect an account.</TYPE.largeHeader>
      </BodyWrapper>
    )
  }

  return (
    <BodyWrapper style={{ maxWidth: '534px', padding: 24 }}>
      <AutoColumn gap="16px">
        <AutoRow style={{ alignItems: 'center', justifyContent: 'space-between' }} gap="8px">
          <div style={{ cursor: 'pointer' }}>
            <ArrowLeft onClick={handleBack} />
          </div>
          <TYPE.mediumHeader>Migrate {token?.symbol} Pool Tokens</TYPE.mediumHeader>
          <div>
            <QuestionHelper text="Migrate your liquidity tokens from Vexchange V1 to Vexchange V2." />
          </div>
        </AutoRow>

        {userLiquidityBalance && token ? (
          <V1PairMigration liquidityTokenAmount={userLiquidityBalance} token={token} />
        ) : (
          <EmptyState message="Loading..." />
        )}
      </AutoColumn>
    </BodyWrapper>
  )
}
