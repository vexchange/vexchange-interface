import React, { useEffect, useState } from 'react'
import Confetti from 'react-confetti'
import Typist from 'react-typist'
import styled from 'styled-components'
import { utils } from 'ethers'

import { TYPE } from '../../theme'
import { useDarkModeManager } from '../../state/user/hooks'
import Logo from '../../assets/svg/logo.svg'
import LogoDark from '../../assets/svg/logo_white.svg'
import { useWeb3React } from '../../hooks'

import Modal from '../Modal'

import Rewards from './rewards.json'

const StyledType = styled(Typist)`
  font-size: 2em;
  font-family: 'Pacifico', cursive;
`

const TypeContainer = styled.div`
  width: 225px;
  margin-bottom: 10px;
`

const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
  width: 100%;
`

const VexIcon = styled.div`
  margin-bottom: 10px;
`

export default function AddressClaimModal() {
  const { chainId, account, library } = useWeb3React()
  const [isDark] = useDarkModeManager()
  const [openModal, setOpenModal] = useState(false)
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    const init = () => {
      const balance = Rewards[utils.getAddress(account)]

      if (balance > 0) {
        setBalance(balance)
        setOpenModal(true)
        localStorage.setItem(account, JSON.stringify({ seen: true }))
      }
    }

    if (account && balance === 0) {
      const { seen } = JSON.parse(localStorage.getItem(account)) || {}
      if (seen) return

      init()
    }
  }, [account, chainId, library, balance])

  const onDismiss = () => {
    setOpenModal(false)
  }

  return (
    <Modal isOpen={openModal} onDismiss={onDismiss} maxHeight={90}>
      <Container>
        <TypeContainer>
          <StyledType cursor={{ show: false }}>Congratulations!</StyledType>
        </TypeContainer>
        <VexIcon>
          <img src={isDark ? LogoDark : Logo} alt="logo" />
        </VexIcon>
        {balance > 0 ? <TYPE.main>You were airdropped {balance} VEX tokens</TYPE.main> : null}
        <Confetti />
      </Container>
    </Modal>
  )
}
