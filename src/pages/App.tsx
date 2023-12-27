import React, { Suspense, useEffect } from 'react'
import styled, { css } from 'styled-components'
import ReactGA from 'react-ga'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { NavigationTabs } from '../components/NavigationTabs'
import Web3ReactManager from '../components/Web3ReactManager'
import { useDarkModeManager } from '../state/user/hooks'

import Popups from '../components/Popups'
import { isAddress } from '../utils'

import { Swap } from './Swap'
import { Send } from './Send'
import { Supply, AddLiquidity } from './Pool'
import Remove from './Pool/RemoveLiquidity'
import { PoolFinder } from '../components/PoolFinder'
import { CreatePool } from '../components/CreatePool'
import Disclaimer from '../components/Disclaimer'

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  overflow-x: hidden;
  height: 100vh;
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  padding-top: 160px;
  align-items: center;
  flex: 1;
  overflow: auto;
  z-index: 10;
  transition: height 0.3s ease;

  & > * {
    max-width: calc(420px + 4rem);
    width: 90%;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      padding: 16px;
  `};

  z-index: 1;
`

const Body = styled.div<{ isDark?: boolean }>`
  border-radius: 8px;
  box-sizing: border-box;
  margin-bottom: 10rem;
  max-width: 534px;
  padding: 4px;
  position: relative;
  width: 100%;
  z-index: 0;
  border: 1px solid black;
`

const StyledRed = styled.div`
  width: 100%;
  height: 200vh;
  background: ${({ theme }) => `radial-gradient(50% 50% at 50% 50%, ${theme.primary1} 0%, ${theme.bg1} 100%)`};
  position: absolute;
  top: 0px;
  left: 0px;
  opacity: 0.1;
  z-index: -1;

  transform: translateY(-70vh);

  @media (max-width: 960px) {
    height: 300px;
    width: 100%;
    transform: translateY(-150px);
  }
`

// fires a GA pageview every time the route changes
function GoogleAnalyticsReporter({ location: { pathname, search } }) {
  useEffect(() => {
    ReactGA.pageview(`${pathname}${search}`)
  }, [pathname, search])
  return null
}

export default function App() {
  const [isDark] = useDarkModeManager()

  return (
    <>
      <Suspense fallback={null}>
        <BrowserRouter>
          <AppWrapper>
            <HeaderWrapper>
              <Header />
            </HeaderWrapper>
            <BodyWrapper>
              <Popups />
              <Web3ReactManager>
                <Body>
                  <NavigationTabs />
                  <Routes>
                    <Route path="/">
                      <Route index element={<Swap />} />
                      <Route path="/swap" element={<Swap />} />
                      <Route path="/send" element={<Send />} />
                      <Route path="/find" element={<PoolFinder />} />
                      <Route path="/create" element={<CreatePool />} />
                      <Route path="/pool" element={<Supply />} />
                      <Route
                        path={'/add/:tokens'}
                        element={({ match }) => {
                          const tokens = match.params.tokens.split('-')
                          const t0 =
                            tokens?.[0] === 'VET' ? 'VET' : isAddress(tokens?.[0]) ? isAddress(tokens[0]) : undefined
                          const t1 =
                            tokens?.[1] === 'VET' ? 'VET' : isAddress(tokens?.[1]) ? isAddress(tokens[1]) : undefined
                          if (t0 && t1) {
                            return <AddLiquidity token0={t0} token1={t1} />
                          } else {
                            return <Redirect to="/pool" />
                          }
                        }}
                      />
                      <Route
                        path={'/remove/:tokens'}
                        element={({ match }) => {
                          const tokens = match.params.tokens.split('-')
                          const t0 =
                            tokens?.[0] === 'VET' ? 'VET' : isAddress(tokens?.[0]) ? isAddress(tokens[0]) : undefined
                          const t1 =
                            tokens?.[1] === 'VET' ? 'VET' : isAddress(tokens?.[1]) ? isAddress(tokens[1]) : undefined
                          if (t0 && t1) {
                            return <Remove token0={t0} token1={t1} />
                          } else {
                            return <Redirect to="/pool" />
                          }
                        }}
                      />
                      {/* <Redirect to="/swap" /> */}
                    </Route>
                  </Routes>
                </Body>
                <Disclaimer />
              </Web3ReactManager>
              <Footer />
            </BodyWrapper>
            <StyledRed />
          </AppWrapper>
        </BrowserRouter>
        <div id="popover-container" />
      </Suspense>
    </>
  )
}
