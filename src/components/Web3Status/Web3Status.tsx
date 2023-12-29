import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Activity } from 'react-feather'
import { clsx } from 'clsx'
import { Button } from '@chakra-ui/react'

import { useWeb3React, UnsupportedChainIdError } from '../../context/'
import { useWalletModalToggle } from '../../state/application/hooks'
import { TransactionDetails } from '../../state/transactions/reducer'

import Identicon from '../Identicon'
import WalletModal from '../WalletModal'
import { ButtonSecondary } from '../Button'

import { Spinner } from '../../theme'
import LightCircle from '../../assets/svg/lightcircle.svg'

import { RowBetween } from '../Row'
import { shortenAddress } from '../../utils'
import { useAllTransactions } from '../../state/transactions/hooks'
import { NetworkContextName } from '../../constants'

import styles from './web3-status.module.scss'

// we want the latest one to come first, so return negative if a is after b
function newTranscationsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

function recentTransactionsOnly(a: TransactionDetails) {
  return new Date().getTime() - a.addedTime < 86_400_000
}

export const Web3Status = ({ account, active }) => {
  const { t } = useTranslation()
  const { error } = useWeb3React()
  const contextNetwork = useWeb3React(NetworkContextName)

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(recentTransactionsOnly).sort(newTranscationsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)
  const confirmed = sortedRecentTransactions.filter(tx => tx.receipt).map(tx => tx.hash)

  const hasPendingTransactions = !!pending.length

  const toggleWalletModal = useWalletModalToggle()

  function getWeb3Status() {
    if (account) {
      return (
        <ButtonSecondary
          className={clsx(styles['web3-status'], styles['web3-status-connected'])}
          id="web3-status-connected"
          onClick={toggleWalletModal}
          pending={hasPendingTransactions}
        >
          {hasPendingTransactions ? (
            <RowBetween>
              <p className={styles.text}>{pending?.length} Pending</p>{' '}
              <Spinner className={styles['spinner-wrapper']} src={LightCircle} alt="loader" />
            </RowBetween>
          ) : (
            <p>{shortenAddress(account)}</p>
          )}
          {!hasPendingTransactions && <Identicon />}
        </ButtonSecondary>
      )
    } else if (error) {
      return (
        <Button className={clsx(styles['web3-status'], styles['web3-status-error'])} onClick={toggleWalletModal}>
          <Activity className={styles['network-icon']} />
          <p className={styles.text}>{error instanceof UnsupportedChainIdError ? 'Wrong Network' : 'Error'}</p>
        </Button>
      )
    } else {
      return (
        // <Web3StatusConnect id="connect-wallet" onClick={toggleWalletModal} faded={!account}>
        <Button
          variant="primary"
          className={clsx(styles['web3-status'], styles['web3-status-connect'])}
          id="connect-wallet"
          onClick={toggleWalletModal}
        >
          <p className={styles.text}>{t('Connect to a wallet')}</p>
        </Button>
      )
    }
  }

  if (!contextNetwork.active && !active) {
    return null
  }

  return (
    <>
      {getWeb3Status()}
      <WalletModal pendingTransactions={pending} confirmedTransactions={confirmed} />
    </>
  )
}
