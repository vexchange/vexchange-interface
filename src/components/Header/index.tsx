import React, { useState, useEffect } from 'react'
import { Link as HistoryLink } from 'react-router-dom'
import { Sun, Moon } from 'react-feather'
import { find } from 'lodash'
import { utils } from 'ethers'

import styled, { css } from 'styled-components'
import { useTokenBalanceTreatingWETHasETH } from '../../state/wallet/hooks'

import Row from '../Row'
import Menu from '../Menu'
import Web3Status from '../Web3Status'

import { Link } from '../../theme'
import { Text } from 'rebass'
import { WVET, ChainId } from 'vexchange-sdk'
import { isMobile } from 'react-device-detect'
import { YellowCard } from '../Card'
import { useWeb3React } from '../../hooks'
import { useDarkModeManager } from '../../state/user/hooks'
import { ButtonSecondary } from '../Button'

import { VEX } from '../../constants/index'
import ERC20_ABI from '../../constants/abis/erc20.json'
import Logo from '../../assets/svg/logo.svg'
import Wordmark from '../../assets/svg/wordmark_light.svg'
import LogoDark from '../../assets/svg/logo_white.svg'
import WordmarkDark from '../../assets/svg/wordmark_dark.svg'
import { RowBetween } from '../Row'
import { AutoColumn } from '../Column'

const HeaderFrame = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  top: 0;
  position: absolute;

  pointer-events: none;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 12px 0 0 0;
    width: calc(100%);
    position: relative;
  `};
  z-index: 2;
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;
`

const VexIcon = styled(HistoryLink)<{ to: string }>`
  transition: transform 0.3s ease;
  :hover {
    transform: scale(1.1);
  }
`

const Title = styled.div`
  display: flex;
  align-items: center;
  pointer-events: auto;

  :hover {
    cursor: pointer;
  }

  @media (max-width: 500px) {
    ${VexIcon} {
      display: none;
    }
  }
`

const TitleText = styled(Row)`
  width: fit-content;
  white-space: nowrap;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  // background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg3)};
  background-image: linear-gradient(137deg, rgba(231, 150, 49, 0.57) 0%, rgba(217, 41, 33, 0.4) 100%);
  border-radius: 20px;
  white-space: nowrap;

  :focus {
    border: 1px solid blue;
  }

  > div:first-of-type {
    position: relative;

    &:after {
      content: "";
      display: block;
      background: rgba(0, 0, 0, 0.1);
      height: 100%;
      width: 2px;
      right: -2px;
      top: 0;
      position: absolute;
    }
  }
`

const TestnetWrapper = styled.div`
  white-space: nowrap;
  width: fit-content;
  margin-left: 10px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`

const NetworkCard = styled(YellowCard)`
  width: fit-content;
  margin-right: 10px;
  border-radius: 12px;
  padding: 8px 12px;
`

const MigrateBanner = styled(AutoColumn)<{ isDark?: boolean }>`
  width: 100%;
  padding: 12px 0;
  display: flex;
  justify-content: center;
  color: ${({ theme }) => theme.primaryText1};
  font-weight: 400;
  text-align: center;
  pointer-events: auto;
  a {
    color: ${({ theme }) => theme.primaryText1};
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 0;
    display: none;
  `};
  ${({ isDark }) =>
    isDark
      ? css`
          background-image: linear-gradient(
            210deg,
            rgba(189, 162, 47, 0.02) 0%,
            rgba(255, 255, 255, 0.02) 13%,
            rgba(217, 216, 216, 0.15) 38%,
            rgba(226, 225, 225, 0.08) 61%,
            rgba(51, 41, 41, 0) 77%,
            #893726 100%
          );
        `
      : css`
          background-image: linear-gradient(
              210deg,
              rgba(189, 162, 47, 0.02) 0%,
              rgba(255, 255, 255, 0.02) 13%,
              rgba(217, 216, 216, 0.15) 38%,
              rgba(226, 225, 225, 0.08) 61%,
              rgba(51, 41, 41, 0) 77%,
              #efa29a 100%
            );
          );
        `}
`

const getTokenBalance = (tokenAddress, address, library): Promise<number> => {
  const abi = find(ERC20_ABI, { name: 'balanceOf' })

  return new Promise(async (resolve, reject) => {
    const account = library.thor.account(tokenAddress)
    const method = account.method(abi)

    try {
      const {
        decoded: { balance }
      } = await method.call(address)

      resolve(parseFloat(utils.formatEther(balance)))
    } catch (error) {
      reject(error)
    }
  })
}

export default function Header() {
  const { account, chainId, active, library } = useWeb3React()
  const [darkMode, toggleDarkMode] = useDarkModeManager()
  const [userVexBalance, setUserVexBalance] = useState(0)

  const userEthBalance = useTokenBalanceTreatingWETHasETH(account, WVET[chainId])
  const [isDark] = useDarkModeManager()

  useEffect(() => {
    const getUserVexBalance = async () => {
      const tokenBalance = await getTokenBalance(VEX[chainId].address, account, library)

      setUserVexBalance(tokenBalance)
    }

    if (account && userVexBalance === 0) {
      getUserVexBalance()
    }
  }, [account, userVexBalance, chainId, library])

  return (
    <HeaderFrame>
      <MigrateBanner isDark={isDark}>
        $VEX is here!&nbsp;
        <Link href="https://medium.com/@vexchange/vex-launch-information-9e14b9da4b64">
          <b>Read about it here ↗</b>
        </Link>
        &nbsp;or&nbsp;
        <HistoryLink to="add/0xD8CCDD85abDbF68DFEc95f06c973e87B1b5A9997-0x0BD802635eb9cEB3fCBe60470D2857B86841aab6">
          <b>Add Liquidity</b>
        </HistoryLink>
        &nbsp;then&nbsp;
        <Link href="https://farm.vexchange.io">
          <b>Stake your LP Tokens ↗</b>
        </Link>
      </MigrateBanner>
      <RowBetween padding="1rem">
        <HeaderElement>
          <Title>
            <VexIcon id="link" to="/">
              <img src={isDark ? LogoDark : Logo} alt="logo" />
            </VexIcon>
            {!isMobile && (
              <TitleText>
                <HistoryLink id="link" to="/">
                  <img
                    style={{ marginLeft: '10px', marginTop: '4px' }}
                    src={isDark ? WordmarkDark : Wordmark}
                    alt="logo"
                  />
                </HistoryLink>
              </TitleText>
            )}
          </Title>
        </HeaderElement>
        <HeaderElement>
          <TestnetWrapper>
            {!isMobile && chainId === ChainId.TESTNET && <NetworkCard>Ropsten</NetworkCard>}
          </TestnetWrapper>
          <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
            {account && userEthBalance ? (
              <>
                <Text style={{ flexShrink: 0 }} px="0.5rem" fontSize="0.85rem" fontWeight={500}>
                  {userVexBalance} VEX
                </Text>
                <Text style={{ flexShrink: 0 }} px="0.5rem" fontSize="0.85rem" fontWeight={500}>
                  {userEthBalance?.toSignificant(4)} VET
                </Text>
              </>
            ) : null}
            <Web3Status account={account} active={active} />
          </AccountElement>
          <ButtonSecondary
            isDark={isDark}
            ml="0.5rem"
            onClick={toggleDarkMode}
            p="8px 12px"
            style={{ pointerEvents: 'auto' }}
            width="min-content"
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </ButtonSecondary>
          <div style={{ pointerEvents: 'auto' }}>
            <Menu />
          </div>
        </HeaderElement>
      </RowBetween>
    </HeaderFrame>
  )
}
