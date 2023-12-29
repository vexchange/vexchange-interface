import React, { useCallback } from 'react'
import styled, { css } from 'styled-components'
import { darken } from 'polished'
import { useTranslation } from 'react-i18next'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import * as isExternal from 'is-url-external'
import { Tabs, TabList, TabPanels, Tab, TabPanel, Flex, TabIndicator, Text, Button } from '@chakra-ui/react'
import { ArrowLeft } from 'react-feather'
import { useDarkMode } from 'usehooks-ts'

import { RowBetween } from '../Row'
import { QuestionHelper } from '../QuestionHelper'

import { useBodyKeyDown } from '../../hooks'

const tabOrder = [
  {
    path: '/swap',
    textKey: 'swap',
    regex: /\/swap/
  },
  {
    path: '/pool',
    textKey: 'pool',
    regex: /\/pool/
  },
  {
    path: 'https://farm.vexchange.io/',
    textKey: 'farm'
  }
]

export const NavigationTabs = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { pathname } = location

  const { isDarkMode, toggle } = useDarkMode()

  const go = useCallback(
    direction => {
      const tabIndex = tabOrder.findIndex(({ regex }) => pathname.match(regex))
      navigate(tabOrder[(tabIndex + tabOrder.length + direction) % tabOrder.length].path)
    },
    [pathname, navigate]
  )
  const navigateRight = useCallback(() => {
    go(1)
  }, [go])
  const navigateLeft = useCallback(() => {
    go(-1)
  }, [go])

  useBodyKeyDown('ArrowRight', navigateRight)
  useBodyKeyDown('ArrowLeft', navigateLeft)

  const adding = pathname.match('/add')
  const removing = pathname.match('/remove')
  const finding = pathname.match('/find')
  const creating = pathname.match('/create')

  return (
    <>
      {adding || removing ? (
        <Flex width="100%" justify="space-between">
          <Button onClick={() => navigate('/pool')}>
            <ArrowLeft size={16} />
          </Button>
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
        <Flex justify="space-between" p={4}>
          <NavLink to="/pool">
            <ArrowLeft size={16} />
          </NavLink>
          <Text>Import Pool</Text>
          <QuestionHelper text={"Use this tool to find pairs that don't automatically appear in the interface."} />
        </Flex>
      ) : creating ? (
        <Flex justify="space-between" p={4}>
          <NavLink to="/pool">
            <ArrowLeft size={16} />
          </NavLink>
          <Text>Create Pool</Text>
          <QuestionHelper text={'Use this interface to create a new pool.'} />
        </Flex>
      ) : (
        <Tabs variant="unstyled">
          <TabList>
            {tabOrder.map(({ path, textKey, regex }) => (
              <Tab key={path}>
                {isExternal(path) ? (
                  <NavLink to={path} target="_blank">
                    Farm
                  </NavLink>
                ) : (
                  <NavLink
                    to={path}
                    // isActive={(_, { pathname }) => !!pathname.match(regex)}
                  >
                    {t(textKey)}
                  </NavLink>
                )}
              </Tab>
            ))}
          </TabList>
          <TabIndicator mt="-1.5px" height="1px" bg="black" />
        </Tabs>
      )}
    </>
  )
}
