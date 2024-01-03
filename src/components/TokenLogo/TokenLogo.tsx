import React, { useState } from 'react'
import styled from 'styled-components'
import { isAddress } from '../../utils'
import { useWeb3React } from '../../hooks'
import { WVET } from 'vexchange-sdk/dist'
import { DUMMY_VET } from '../../constants'

import WvetIcon from '../../assets/images/wvet-logo.png'

import styles from './token-logo.module.scss'

const TOKEN_ICON_API = address =>
  `https://raw.githubusercontent.com/vechain/token-registry/master/tokens/main/${address}/token.png`
const BAD_IMAGES = {}

export const TokenLogo = ({
  address,
  size = '24px',
  ...rest
}: {
  address?: string
  size?: string
  style?: React.CSSProperties
}) => {
  const [error, setError] = useState(false)
  const { chainId } = useWeb3React()

  // mock rinkeby DAI
  if (chainId === 4 && address === '0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735') {
    address = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
  }

  let path = ''
  if (address === DUMMY_VET[chainId].address) {
    return <svg className={styles['token-logo']} style={{ width: size, height: size }} {...rest} />
  } else if (address === WVET[chainId].address) {
    path = WvetIcon
  } else if (!error && !BAD_IMAGES[address] && isAddress(address)) {
    path = TOKEN_ICON_API(address.toLowerCase())
  } else {
    return (
      <span className={styles.emoji} {...rest} style={{ width: size, height: size }}>
        <span role="img" aria-label="Thinking">
          🤔
        </span>
      </span>
    )
  }

  return (
    <img
      className={styles['token-logo']}
      {...rest}
      // alt={address}
      src={path}
      style={{ width: size, height: size }}
      onError={() => {
        BAD_IMAGES[address] = true
        setError(true)
      }}
    />
  )
}
