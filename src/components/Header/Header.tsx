import React, { useState, useEffect } from 'react'
import { Link as HistoryLink } from 'react-router-dom'
import { Sun, Moon } from 'react-feather'
import { find } from 'lodash'
import { formatEther } from 'ethers'
import { isMobile } from 'react-device-detect'
import { useDarkMode } from 'usehooks-ts'

import styled, { css } from 'styled-components'
import { useTokenBalanceTreatingWETHasETH } from '../../state/wallet/hooks'

import Row from '../Row'
import Menu from '../Menu'
import Web3Status from '../Web3Status'

import { Text } from 'rebass'
import { ChainId } from 'vexchange-sdk/dist'
import { YellowCard } from '../Card'
import { useWeb3React } from '../../hooks'
import { ButtonSecondary } from '../Button'

import { DUMMY_VET, VEX } from '../../constants/index'
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

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 20px;
  white-space: nowrap;

  :focus {
    border: 1px solid blue;
  }

  > div:first-of-type {
    position: relative;

    &:after {
      content: '';
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

const getTokenBalance = (tokenAddress, address, library): Promise<number> => {
  const abi = find(ERC20_ABI, { name: 'balanceOf' })

  return new Promise(async (resolve, reject) => {
    const account = library.thor.account(tokenAddress)
    const method = account.method(abi)

    try {
      const {
        decoded: { balance }
      } = await method.call(address)

      resolve(parseFloat(formatEther(balance)))
    } catch (error) {
      reject(error)
    }
  })
}

export const Header = () => {
  const { account, chainId, active, library } = useWeb3React()
  const { isDarkMode, toggle } = useDarkMode()

  const [userVexBalance, setUserVexBalance] = useState(0)

  const userEthBalance = useTokenBalanceTreatingWETHasETH(account, DUMMY_VET[chainId])

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
      <RowBetween>
        <HeaderElement>
          <Title>Vexchange</Title>
        </HeaderElement>
        <HeaderElement>
          <TestnetWrapper>
            {!isMobile && chainId === ChainId.TESTNET && <NetworkCard>Ropsten</NetworkCard>}
          </TestnetWrapper>
          {/* <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}> */}
          <AccountElement style={{ pointerEvents: 'auto' }}>
            {account && userEthBalance ? (
              <>
                <Text style={{ flexShrink: 0 }} px="0.5rem" fontSize="0.85rem" fontWeight={500}>
                  {userVexBalance.toFixed(2)} VEX
                </Text>
                <Text style={{ flexShrink: 0 }} px="0.5rem" fontSize="0.85rem" fontWeight={500}>
                  {userEthBalance?.toSignificant(4)} VET
                </Text>
              </>
            ) : null}
            <Web3Status account={account} />
            {/* <Web3Status account={account} active={active} /> */}
          </AccountElement>
          <ButtonSecondary
            // isDark={isDark}
            ml="0.5rem"
            onClick={toggle}
            p="8px 12px"
            style={{ pointerEvents: 'auto' }}
            width="min-content"
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </ButtonSecondary>

          <div style={{ pointerEvents: 'auto' }}>
            <Menu />
          </div>
        </HeaderElement>
      </RowBetween>
    </HeaderFrame>
  )
}
