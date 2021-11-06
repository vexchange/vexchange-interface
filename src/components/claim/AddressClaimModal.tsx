import React, { useEffect, useState } from 'react'
import Confetti from 'react-confetti'
import Typist from 'react-typist'
import styled from 'styled-components'
import { find } from 'lodash'
import { utils } from 'ethers'

import Modal from '../Modal'

import { TYPE } from '../../theme'
import { useDarkModeManager } from '../../state/user/hooks'
import Logo from '../../assets/svg/logo.svg'
import LogoDark from '../../assets/svg/logo_white.svg'
import { VEX } from '../../constants/index'
import ERC20_ABI from '../../constants/abis/erc20.json'
import { useWeb3React } from '../../hooks'

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

export default function AddressClaimModal() {
  const { chainId, account, library } = useWeb3React()
  const [isDark] = useDarkModeManager()
  const [openModal, setOpenModal] = useState(false)
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    const init = async () => {
      const tokenBalance = await getTokenBalance(VEX[chainId].address, account, library)

      if (tokenBalance > 0) {
        setBalance(tokenBalance)
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
