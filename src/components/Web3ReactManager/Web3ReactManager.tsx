import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { useWeb3React } from '../../context/'
import { network } from '../../connectors'
import { useEagerConnect, useInactiveListener } from '../../hooks'
import { Spinner } from '../../theme'
import Circle from '../../assets/images/circle.svg'
import { NetworkContextName } from '../../constants'

import styles from './web3-react-manager.module.scss'

export const Web3ReactManager = ({ children }) => {
  const { t } = useTranslation()
  const { active } = useWeb3React()
  const { active: networkActive, error: networkError, activate: activateNetwork } = useWeb3React(NetworkContextName)

  // try to eagerly connect to an injected provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // after eagerly trying injected, if the network connect ever isn't active or in an error state, activate itd
  useEffect(() => {
    if (triedEager && !networkActive && !networkError && !active) {
      //@ts-ignore
      activateNetwork(network)
    }
  }, [triedEager, networkActive, networkError, activateNetwork, active])

  // 'pause' the network connector if we're ever connected to an account and it's active
  useEffect(() => {
    if (active && networkActive) {
      network.pause()
    }
  }, [active, networkActive])

  // 'resume' the network connector if we're ever not connected to an account and it's active
  useEffect(() => {
    if (!active && networkActive) {
      network.resume()
    }
  }, [active, networkActive])

  // when there's no account connected, react to logins (broadly speaking) on the injected provider, if it exists
  useInactiveListener(!triedEager)

  // handle delayed loader state
  const [showLoader, setShowLoader] = useState(false)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoader(true)
    }, 600)

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  // on page load, do nothing until we've tried to connect to the injected connector
  if (!triedEager) {
    return null
  }

  // if the account context isn't active, and there's an error on the network context, it's an irrecoverable error
  if (!active && networkError) {
    return (
      <div className={styles['message-wrapper']}>
        <h2 className={styles.message}>{t('unknownError')}</h2>
      </div>
    )
  }

  // if neither context is active, spin
  if (!active && !networkActive) {
    return showLoader ? (
      <div className={styles['message-wrapper']}>
        <Spinner className={styles.spinner} src={Circle} />
      </div>
    ) : null
  }

  return children
}
