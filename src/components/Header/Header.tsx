import React, { useState, useEffect } from 'react'
import { Link as HistoryLink } from 'react-router-dom'
import { Sun, Moon } from 'react-feather'
import { find } from 'lodash'
import { formatEther } from 'ethers'
import { isMobile } from 'react-device-detect'
import { useDarkMode } from 'usehooks-ts'
import { Text, HStack, Flex, Button, Box } from '@chakra-ui/react'
import { ChainId } from 'vexchange-sdk/dist'

import { useTokenBalanceTreatingWETHasETH } from '../../state/wallet/hooks'
import { useWeb3React } from '../../hooks'
import { DUMMY_VET, VEX } from '../../constants/index'
import ERC20_ABI from '../../constants/abis/erc20.json'

import Menu from '../Menu'
import { Web3Status } from '../Web3Status'

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
    <HStack p={4} width="100%">
      <Flex justify="space-between" width="100%">
        <Box>
          <h1>vexchange</h1>
        </Box>

        <HStack>
          {/* <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}> */}
          <div>
            {account && userEthBalance ? (
              <>
                <Text style={{ flexShrink: 0 }} px="0.5rem">
                  {userVexBalance.toFixed(2)} VEX
                </Text>
                <Text style={{ flexShrink: 0 }} px="0.5rem">
                  {userEthBalance?.toSignificant(4)} VET
                </Text>
              </>
            ) : null}
            <Web3Status account={account} />
            {/* <Web3Status account={account} active={active} /> */}
          </div>

          <Button
            // isDark={isDark}
            variant="primary"
            onClick={toggle}
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </Button>

          <Menu />
        </HStack>
      </Flex>
    </HStack>
  )
}
