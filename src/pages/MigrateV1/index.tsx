import { Fraction, JSBI, Token, TokenAmount } from 'vexchange-sdk'
import React, { useCallback, useMemo, useState } from 'react'
import { ArrowLeft } from 'react-feather'
import { RouteComponentProps } from 'react-router'
import { ButtonPrimary } from '../../components/Button'
import { AutoColumn } from '../../components/Column'
import { LightCard } from '../../components/Card'
import { AutoRow } from '../../components/Row'
import { SearchInput } from '../../components/SearchModal/styleds'
import TokenLogo from '../../components/TokenLogo'
import { useWeb3React } from '../../hooks'
import { useTokenByAddressAndAutomaticallyAdd } from '../../hooks/Tokens'
import { useWalletModalToggle } from '../../state/application/hooks'
import { useTokenBalances } from '../../state/wallet/hooks'
import { TYPE } from '../../theme'
import { GreyCard } from '../../components/Card'
import { BodyWrapper } from '../AppBody'
import { EmptyState } from './EmptyState'

const POOL_TOKEN_AMOUNT_MIN = new Fraction(JSBI.BigInt(1), JSBI.BigInt(1000000))

const getExchanges = () => ({
  // exchange address
  '0xf9f99f982f3ea9020f0a0afd4d4679dfee1b63cf': {
    address: '0x0000000000000000000000000000456E65726779',
    chainId: 1,
    decimals: 18,
    name: 'VeThor',
    symbol: 'VTHO'
  },
  '0xDC391a5dbB89a3F768c41Cfa0e85dcaAF3A91f91': {
    address: '0x0ce6661b4ba86a0ea7ca2bd86a0de87b0b860f14',
    chainId: 1,
    decimals: 18,
    name: 'OceanEx',
    symbol: 'OCE'
  },
  '0x18C2385481cDf28779aC271272398dD61cc8CF3E': {
    address: '0x1b8ec6c2a45cca481da6f243df0d7a5744afc1f8',
    chainId: 1,
    decimals: 18,
    name: 'Decent.bet',
    symbol: 'DBET'
  },
  '0x274e368395Fe268772d532A5a8E364C93FEE330C': {
    address: '0xacc280010b2ee0efc770bce34774376656d8ce14',
    chainId: 1,
    decimals: 8,
    name: 'HackenAI',
    symbol: 'HAI'
  },
  '0xC19cf5Dfb71374b920F786078D37b5225CFcF30E': {
    address: '0x5db3c8a942333f6468176a870db36eef120a34dc',
    chainId: 1,
    decimals: 18,
    name: 'Safe Haven',
    symbol: 'SHA'
  },
  '0xD293f479254D5F6494c66A4982C7cA514A53D7C4': {
    address: '0x89827f7bb951fd8a56f8ef13c5bfee38522f2e1f',
    chainId: 1,
    decimals: 18,
    name: 'Plair',
    symbol: 'PLA'
  },
  '0x6D08D19Dff533050f93EaAa0a009e2771D3598bC': {
    address: '0xf8e1fAa0367298b55F57Ed17F7a2FF3F5F1D1628',
    chainId: 1,
    decimals: 18,
    name: 'Eight Hours Token',
    symbol: 'EHrT'
  },
  '0xfECA5a0C2ffD0C894b986f93B492B572236a347a': {
    address: '0x46209D5e5a49C1D403F4Ee3a0A88c3a27E29e58D',
    chainId: 1,
    decimals: 18,
    name: 'Jur',
    symbol: 'JUR'
  },
  '0x6bC4d17c76Fc48ab6c99288D57edd65d0371C87E': {
    address: '0x67fD63f6068962937EC81AB3Ae3bF9871E524FC9',
    chainId: 1,
    decimals: 18,
    name: 'VEED',
    symbol: 'VEED'
  }
})

export function FormattedPoolTokenAmount({ tokenAmount }: { tokenAmount: TokenAmount }) {
  return (
    <>
      {tokenAmount.equalTo(JSBI.BigInt(0))
        ? '0'
        : tokenAmount.greaterThan(POOL_TOKEN_AMOUNT_MIN)
        ? tokenAmount.toSignificant(6)
        : `<${POOL_TOKEN_AMOUNT_MIN.toSignificant(1)}`}
    </>
  )
}

export default function MigrateV1({ history }: RouteComponentProps) {
  const { account, chainId } = useWeb3React()
  const allV1Exchanges = getExchanges()

  const v1LiquidityTokens: Token[] = useMemo(() => {
    return Object.keys(allV1Exchanges).map(exchangeAddress => new Token(chainId, exchangeAddress, 18))
  }, [chainId, allV1Exchanges])

  const v1LiquidityBalances = useTokenBalances(account, v1LiquidityTokens)

  const [tokenSearch, setTokenSearch] = useState<string>('')
  const handleTokenSearchChange = useCallback(e => setTokenSearch(e.target.value), [setTokenSearch])

  const searchedToken: Token | undefined = useTokenByAddressAndAutomaticallyAdd(tokenSearch)

  const unmigratedLiquidityExchangeAddresses: TokenAmount[] = useMemo(
    () =>
      Object.keys(v1LiquidityBalances)
        .filter(tokenAddress =>
          v1LiquidityBalances[tokenAddress]
            ? JSBI.greaterThan(v1LiquidityBalances[tokenAddress]?.raw, JSBI.BigInt(0))
            : false
        )
        .map(tokenAddress => v1LiquidityBalances[tokenAddress])
        .sort((a1, a2) => {
          if (searchedToken) {
            if (allV1Exchanges[a1.token.address].address === searchedToken.address) return -1
            if (allV1Exchanges[a2.token.address].address === searchedToken.address) return 1
          }
          return a1.token.address.toLowerCase() < a2.token.address.toLowerCase() ? -1 : 1
        }),
    [allV1Exchanges, searchedToken, v1LiquidityBalances]
  )

  const toggleWalletModal = useWalletModalToggle()

  const handleBackClick = useCallback(() => {
    history.push('/pool')
  }, [history])

  console.log(allV1Exchanges, unmigratedLiquidityExchangeAddresses)
  return (
    <BodyWrapper>
      <AutoColumn gap="24px">
        <AutoRow style={{ justifyContent: 'space-between' }}>
          <div>
            <ArrowLeft style={{ cursor: 'pointer' }} onClick={handleBackClick} />
          </div>
          <TYPE.largeHeader>Migrate Liquidity</TYPE.largeHeader>
          <div></div>
        </AutoRow>
        <GreyCard style={{ marginTop: '0', padding: '1rem', display: 'inline-block' }}>
          <TYPE.main style={{ lineHeight: '140%' }}>
            For each pool, approve the migration helper and click migrate liquidity. Your liquidity will be withdrawn
            from Vexchange V1 and deposited into Vexchange V2.
          </TYPE.main>
          <TYPE.black padding={'1rem 0 0 0'} style={{ lineHeight: '140%' }}>
            If your liquidity does not appear below automatically, you may need to find it by pasting the token address
            into the search box below.
          </TYPE.black>
        </GreyCard>
        <AutoRow>
          <SearchInput
            value={tokenSearch}
            onChange={handleTokenSearchChange}
            placeholder="Find liquidity by pasting a token address."
          />
        </AutoRow>

        {unmigratedLiquidityExchangeAddresses.map(poolTokenAmount => (
          <LightCard key={poolTokenAmount.token.address}>
            <AutoRow style={{ justifyContent: 'space-between' }}>
              <AutoRow style={{ justifyContent: 'flex-start', width: 'fit-content' }}>
                <TokenLogo size="32px" address={allV1Exchanges[poolTokenAmount.token.address.toLowerCase()]?.address} />{' '}
                <div style={{ marginLeft: '.75rem' }}>
                  <TYPE.main fontWeight={600}>
                    <FormattedPoolTokenAmount tokenAmount={poolTokenAmount} />
                  </TYPE.main>
                  <TYPE.main fontWeight={500}>
                    {allV1Exchanges[poolTokenAmount.token.address.toLowerCase()]?.symbol} Pool Tokens
                  </TYPE.main>
                </div>
              </AutoRow>
              <div>
                <ButtonPrimary
                  onClick={() => {
                    history.push(`/migrate/v1/${poolTokenAmount.token.address}`)
                  }}
                  style={{ padding: '8px 12px', borderRadius: '12px' }}
                >
                  Migrate
                </ButtonPrimary>
              </div>
            </AutoRow>
          </LightCard>
        ))}

        {account && unmigratedLiquidityExchangeAddresses.length === 0 ? (
          <EmptyState message="No V1 Liquidity found." />
        ) : null}

        {!account ? <ButtonPrimary onClick={toggleWalletModal}>Connect to a wallet</ButtonPrimary> : null}
      </AutoColumn>
    </BodyWrapper>
  )
}
