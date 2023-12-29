import React, { useState, useEffect } from 'react'
import ReactGA from 'react-ga'
import styled, { css } from 'styled-components'
import { isMobile } from 'react-device-detect'
import { X as Close } from 'react-feather'
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Button,
  Flex
} from '@chakra-ui/react'
import { useDarkMode } from 'usehooks-ts'

import { UnsupportedChainIdError } from '../../context'
import { useWeb3React } from '../../hooks'
import { useWalletModalOpen, useWalletModalToggle } from '../../state/application/hooks'
import { SUPPORTED_WALLETS } from '../../constants'
import { usePrevious } from '../../hooks'
import { Link } from '../../theme'

import AccountDetails from '../AccountDetails'

import PendingView from './PendingView'
import Option from './Option'

const Blurb = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
`

const OptionGrid = styled.div`
  display: grid;
  grid-gap: 10px;
`

const WALLET_VIEWS = {
  OPTIONS: 'options',
  OPTIONS_SECONDARY: 'options_secondary',
  ACCOUNT: 'account',
  PENDING: 'pending'
}

export default function WalletModal({
  pendingTransactions,
  confirmedTransactions
}: {
  pendingTransactions: string[] // hashes of pending
  confirmedTransactions: string[] // hashes of confirmed
}) {
  const { active, account, connector, activate, error } = useWeb3React()

  const { isDarkMode, toggle } = useDarkMode()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT)

  const [pendingWallet, setPendingWallet] = useState()

  const [pendingError, setPendingError] = useState<boolean>()

  const walletModalOpen = useWalletModalOpen()
  const toggleWalletModal = useWalletModalToggle()

  const previousAccount = usePrevious(account)

  // close on connection, when logged out before
  useEffect(() => {
    if (account && !previousAccount && walletModalOpen) {
      onClose()
    }
  }, [account, previousAccount, onClose, walletModalOpen])

  // always reset to account view
  useEffect(() => {
    if (walletModalOpen) {
      setPendingError(false)
      setWalletView(WALLET_VIEWS.ACCOUNT)
    }
  }, [walletModalOpen])

  // close modal when a connection is successful
  const activePrevious = usePrevious(active)
  const connectorPrevious = usePrevious(connector)
  useEffect(() => {
    if (walletModalOpen && ((active && !activePrevious) || (connector && connector !== connectorPrevious && !error))) {
      setWalletView(WALLET_VIEWS.ACCOUNT)
    }
  }, [setWalletView, active, error, connector, walletModalOpen, activePrevious, connectorPrevious])

  const tryActivation = async connector => {
    let name = ''
    Object.keys(SUPPORTED_WALLETS).map(key => {
      if (connector === SUPPORTED_WALLETS[key].connector) {
        return (name = SUPPORTED_WALLETS[key].name)
      }
      return true
    })
    // log selected wallet
    ReactGA.event({
      category: 'Wallet',
      action: 'Change Wallet',
      label: name
    })
    setPendingWallet(connector) // set wallet for pending view
    setWalletView(WALLET_VIEWS.PENDING)
    activate(connector, undefined, true).catch(error => {
      if (error instanceof UnsupportedChainIdError) {
        activate(connector) // a little janky...can't use setError because the connector isn't set
      } else {
        setPendingError(true)
      }
    })
  }

  // get wallets user can switch too, depending on device/browser
  function getOptions() {
    return Object.keys(SUPPORTED_WALLETS).map(key => {
      const option = SUPPORTED_WALLETS[key]
      // check for mobile options
      if (isMobile) {
        return (
          <Button
            variant="primary"
            onClick={() => {
              option.connector !== connector && !option.href && tryActivation(option.connector)
            }}
            id={`connect-${key}`}
            key={key}
            // active={option.connector && option.connector === connector}
            color={option.color}
            link={option.href}
            header={option.name}
          >
            {option.name}
          </Button>
        )
      }

      // return rest of options
      return (
        !isMobile &&
        !option.mobileOnly && (
          <Button
            variant="primary"
            onClick={() => {
              option.connector === connector
                ? setWalletView(WALLET_VIEWS.ACCOUNT)
                : !option.href && tryActivation(option.connector)
            }}
            key={key}
            // active={option.connector === connector}
            link={option.href}
            header={option.name}
            subheader={null} //use option.descriptio to bring back multi-line
          >
            {option.name}
          </Button>
        )
      )
    })
  }

  function getModalContent() {
    if (error) {
      return (
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>{error instanceof UnsupportedChainIdError ? 'Wrong Network' : 'Error connecting'}</ModalHeader>
          <ModalBody>
            {error instanceof UnsupportedChainIdError ? (
              <Text>Please connect to the appropriate VeChain network.</Text>
            ) : (
              'Error connecting. Try refreshing the page.'
            )}
          </ModalBody>
        </ModalContent>
      )
    }
    if (account && walletView === WALLET_VIEWS.ACCOUNT) {
      return (
        <AccountDetails
          onClose={onClose}
          pendingTransactions={pendingTransactions}
          confirmedTransactions={confirmedTransactions}
          openOptions={() => setWalletView(WALLET_VIEWS.OPTIONS)}
        />
      )
    }
    return (
      <ModalContent>
        {walletView !== WALLET_VIEWS.ACCOUNT ? (
          <ModalHeader>
            <Text
              onClick={() => {
                setPendingError(false)
                setWalletView(WALLET_VIEWS.ACCOUNT)
              }}
            >
              Back
            </Text>
          </ModalHeader>
        ) : (
          <ModalHeader>Connect Wallet</ModalHeader>
        )}
        <ModalBody>
          {walletView === WALLET_VIEWS.PENDING ? (
            <PendingView
              // uri={uri}
              size={220}
              connector={pendingWallet}
              error={pendingError}
              setPendingError={setPendingError}
              tryActivation={tryActivation}
            />
          ) : (
            <OptionGrid>{getOptions()}</OptionGrid>
          )}
          {walletView !== WALLET_VIEWS.PENDING && (
            <Flex align="center" justify="center">
              <span>New to VeChain? &nbsp;</span>{' '}
              <Link href="https://medium.com/vechain-foundation/announcing-vechain-sync-2-unlocking-revolution-for-the-entire-blockchain-dapp-industry-enabling-5b1b21cd7b9b">
                Learn more about Sync
              </Link>
            </Flex>
          )}
        </ModalBody>
      </ModalContent>
    )
  }

  return (
    <Modal isOpen={walletModalOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>{getModalContent()}</ModalContent>
    </Modal>
  )
}
