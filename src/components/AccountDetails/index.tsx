import React, { useCallback, useContext } from 'react'
import { useDispatch } from 'react-redux'
import styled, { ThemeContext } from 'styled-components'
import { useWeb3React } from '../../hooks'
import { AppDispatch } from '../../state'
import { clearAllTransactions } from '../../state/transactions/actions'
import { AutoRow } from '../Row'
import Copy from './Copy'
import Transaction from './Transaction'

import { SUPPORTED_WALLETS } from '../../constants'
import { ReactComponent as Close } from '../../assets/images/x.svg'
import { getExploreLink, userAccount } from '../../utils'
import { injected } from '../../connectors'
import Identicon from '../Identicon'


import { Link, TYPE } from '../../theme'

const HeaderRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  padding: 1rem 1rem;
  font-weight: 500;
  color: ${props => (props.color === 'blue' ? ({ theme }) => theme.primary1 : 'inherit')};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem;
  `};

  background-image: linear-gradient(270deg, rgba(255, 255, 255, 0.13) 0%, rgba(255, 255, 255, 0.03) 96%);

  border-radius: 0 0 3px 3px;
`

const UpperSection = styled.div`
  position: relative;

  h5 {
    margin: 0;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 400;
  }

  h5:last-child {
    margin-bottom: 0px;
  }

  h4 {
    margin-top: 0;
    font-weight: 500;
  }
`

const InfoCard = styled.div`
  padding: 1rem;
  background-color: ${({ theme }) => theme.bg2};
  border-radius: 20px;
`

const AccountGroupingRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
  color: ${({ theme }) => theme.text1};

  div {
    ${({ theme }) => theme.flexRowNoWrap}
    align-items: center;
  }

  &:first-of-type {
    margin-bottom: 8px;
  }
`

const AccountSection = styled.div`
  background-color: ${({ theme }) => theme.bg1};
  padding: 1rem;
  ${({ theme }) => theme.mediaWidth.upToMedium`padding: 1rem;`};
`

const YourAccount = styled.div`
  h5 {
    margin: 0 0 1rem 0;
    font-weight: 400;
  }

  h4 {
    margin: 0;
    font-weight: 500;
  }
`

const GreenCircle = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  justify-content: center;
  align-items: center;

  &:first-child {
    height: 8px;
    width: 8px;
    margin-left: 12px;
    margin-right: 2px;
    background-color: ${({ theme }) => theme.green1};
    border-radius: 50%;
  }
`

const CircleWrapper = styled.div`
  color: ${({ theme }) => theme.green1};
  display: flex;
  justify-content: center;
  align-items: center;
`

const LowerSection = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  padding: 1.5rem;
  flex-grow: 1;
  overflow: auto;
  background-color: ${({ theme }) => theme.bg2};
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;

  h5 {
    margin: 0;
    font-weight: 400;
    color: ${({ theme }) => theme.text3};
  }
`

const AccountControl = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  align-items: center;
  min-width: 0;

  font-weight: 500;
  font-size: 1rem;

  a:hover {
    text-decoration: underline;
  }

  p {
    min-width: 0;
    margin: 0.5rem 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.primary1};
`

const CloseIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 14px;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

const CloseColor = styled(Close)`
  path {
    stroke: ${({ theme }) => theme.text4};
  }
`

const WalletName = styled.div`
  padding-left: 0.5rem;
  width: initial;
`

const IconWrapper = styled.div<{ size?: number }>`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  & > img,
  span {
    height: ${({ size }) => (size ? size + 'px' : '32px')};
    width: ${({ size }) => (size ? size + 'px' : '32px')};
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    align-items: flex-end;
  `};
`

const TransactionListWrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap};
`

const WalletAction = styled.div`
  color: ${({ theme }) => theme.text4};
  margin-left: 16px;
  font-weight: 400;
  :hover {
    cursor: pointer;
    text-decoration: underline;
  }
`

function renderTransactions(transactions) {
  return (
    <TransactionListWrapper>
      {transactions.map((hash, i) => {
        return <Transaction key={i} hash={hash} />
      })}
    </TransactionListWrapper>
  )
}

interface AccountDetailsProps {
  toggleWalletModal: () => void
  pendingTransactions: any[]
  confirmedTransactions: any[]
  openOptions: () => void
}

export default function AccountDetails({
  toggleWalletModal,
  pendingTransactions,
  confirmedTransactions,
  openOptions
}: AccountDetailsProps) {
  const { chainId, account, connector } = useWeb3React()
  const theme = useContext(ThemeContext)
  const dispatch = useDispatch<AppDispatch>()

  function formatConnectorName() {
    const { ethereum } = window
    const isMetaMask = !!(ethereum && ethereum.isMetaMask)
    const name = Object.keys(SUPPORTED_WALLETS)
      .filter(
        k =>
          SUPPORTED_WALLETS[k].connector === connector && (connector !== injected || isMetaMask === (k === 'SYNC'))
      )
      .map(k => SUPPORTED_WALLETS[k].name)[0]
    return <WalletName>{name}</WalletName>
  }

  function getStatusIcon() {
    if (account) {
      return (
        <IconWrapper size={16}>
          <Identicon /> {formatConnectorName()}
        </IconWrapper>
      )
    }
  }

  const clearAllTransactionsCallback = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault()
      dispatch(clearAllTransactions({ chainId }))
    },
    [dispatch, chainId]
  )

  return (
    <>
      <UpperSection>
        <CloseIcon onClick={toggleWalletModal}>
          <CloseColor />
        </CloseIcon>
        <HeaderRow>Account</HeaderRow>
        <AccountSection>
          <YourAccount>
            <InfoCard>
              <AccountGroupingRow>
                {getStatusIcon()}
                <div>
                  {account && (
                    <WalletAction
                      onClick={userAccount.remove}
                    >
                      Disconnect
                    </WalletAction>
                  )}
                  <CircleWrapper>
                    <GreenCircle>
                      <div />
                    </GreenCircle>
                  </CircleWrapper>
                </div>
              </AccountGroupingRow>
              <AccountGroupingRow id="web3-account-identifier-row">
                <AccountControl>
                  <p>{account}</p> <Copy toCopy={account} />
                </AccountControl>
              </AccountGroupingRow>
              <AccountGroupingRow>
                <AccountControl>
                  <StyledLink href={getExploreLink(chainId, account, 'address')}>
                    View on VeChain Stats ↗
                  </StyledLink>
                </AccountControl>
              </AccountGroupingRow>
            </InfoCard>
          </YourAccount>
        </AccountSection>
      </UpperSection>
      {!!pendingTransactions.length || !!confirmedTransactions.length ? (
        <LowerSection>
          <AutoRow style={{ justifyContent: 'space-between' }}>
            <TYPE.body>Recent Transactions</TYPE.body>
            <Link onClick={clearAllTransactionsCallback}>(clear all)</Link>
          </AutoRow>
          {renderTransactions(pendingTransactions)}
          {renderTransactions(confirmedTransactions)}
        </LowerSection>
      ) : (
        <LowerSection>
          <TYPE.body color={theme.text1}>Your transactions will appear here...</TYPE.body>
        </LowerSection>
      )}
    </>
  )
}
