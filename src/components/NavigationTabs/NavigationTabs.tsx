import React, { useCallback } from 'react'
import styled, { css } from 'styled-components'
import { darken } from 'polished'
import { useTranslation } from 'react-i18next'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import * as isExternal from 'is-url-external'
import { Tabs, TabList, Tab, Flex, TabIndicator, Text, Link, HStack, Box } from '@chakra-ui/react'
import { ArrowLeft, ExternalLink } from 'react-feather'
import { useDarkMode } from 'usehooks-ts'

import { RowBetween } from '../Row'
import { QuestionHelper } from '../QuestionHelper'

export const NavigationTabs = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const { pathname } = location

  const { isDarkMode, toggle } = useDarkMode()

  const adding = pathname.match('/add')
  const removing = pathname.match('/remove')
  const finding = pathname.match('/find')
  const creating = pathname.match('/create')

  return (
    <Box>
      {adding || removing ? (
        <Flex width="100%" justify="space-between">
          <NavLink to="/pool">
            <ArrowLeft size={16} />
          </NavLink>
          <Text>{adding ? 'Add' : 'Remove'} Liquidity</Text>
          <QuestionHelper
            text={
              adding
                ? 'When you add liquidity, you are given pool tokens that represent your position in this pool. These tokens automatically earn fees proportional to your pool share and can be redeemed at any time.'
                : 'Your liquidity is represented by a pool token (ERC20). Removing will convert your position back into tokens at the current rate and proportional to the amount of each token in the pool. Any fees you accrued are included in the token amounts you receive.'
            }
          />
        </Flex>
      ) : finding ? (
        <Flex justify="space-between">
          <NavLink to="/pool">
            <ArrowLeft size={16} />
          </NavLink>
          <Text>Import Pool</Text>
          <QuestionHelper text={"Use this tool to find pairs that don't automatically appear in the interface."} />
        </Flex>
      ) : creating ? (
        <Flex justify="space-between">
          <NavLink to="/pool">
            <ArrowLeft size={16} />
          </NavLink>
          <Text>Create Pool</Text>
          <QuestionHelper text={'Use this interface to create a new pool.'} />
        </Flex>
      ) : (
        <HStack spacing="24px" mb={4}>
          <NavLink to="/swap">
            <Text>Swap</Text>
          </NavLink>
          <NavLink to="/pool">
            <Text>Pool</Text>
          </NavLink>
          <Link href="https://farm.vexchange.io/" isExternal>
            <HStack spacing="8px">
              <Text>Farm</Text>
              <ExternalLink size="12px" />
            </HStack>
          </Link>
        </HStack>
      )}
    </Box>
  )
}
