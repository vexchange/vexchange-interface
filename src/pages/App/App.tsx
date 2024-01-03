import React, { Suspense, useEffect } from 'react'
import ReactGA from 'react-ga'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Box, Flex } from '@chakra-ui/react'

import { Swap } from '../Swap'
import { Supply } from '../Supply'
import { AddLiquidity } from '../AddLiquidity'
import { RemoveLiquidity } from '../RemoveLiquidity'

import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import { NavigationTabs } from '../../components/NavigationTabs'
import { Web3ReactManager } from '../../components/Web3ReactManager'
import { useDarkModeManager } from '../../state/user/hooks'
import Popups from '../../components/Popups'
import { PoolFinder } from '../../components/PoolFinder'
import { CreatePool } from '../../components/CreatePool'
import Disclaimer from '../../components/Disclaimer'

import styles from './app.module.scss'

export const App = () => {
  const [isDark] = useDarkModeManager()

  return (
    <>
      <Suspense fallback={null}>
        <BrowserRouter>
          <Flex className={styles['app-wrapper']}>
            <Header />
            <div className={styles['body-wrapper']}>
              <Popups />
              <Web3ReactManager>
                <Box className={styles['body']} p={4}>
                  <NavigationTabs />
                  <Routes>
                    <Route path="/">
                      <Route index element={<Swap />} />
                      <Route path="/swap" element={<Swap />} />
                      <Route path="/find" element={<PoolFinder />} />
                      <Route path="/create" element={<CreatePool />} />
                      <Route path="/pool" element={<Supply />} />
                      <Route path={'/add/:tokens'} element={<AddLiquidity />} />
                      <Route path={'/remove/:tokens'} element={<RemoveLiquidity />} />
                    </Route>
                  </Routes>
                </Box>
                <Disclaimer />
              </Web3ReactManager>
              <Footer />
            </div>
            <div className={styles['styles-red']} />
          </Flex>
        </BrowserRouter>
        <div id="popover-container" />
      </Suspense>
    </>
  )
}
