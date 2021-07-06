import React from 'react'
import ReactDOM from 'react-dom'
import ReactGA from 'react-ga'
import { Web3ReactProvider, createWeb3ReactRoot } from './context'
import Connex from '@vechain/connex'
import { Provider } from 'react-redux'

import { NetworkContextName } from './constants'
import WalletUpdater from './state/wallet/updater'
import App from './pages/App'
import store from './state'
import ApplicationUpdater from './state/application/updater'
import TransactionUpdater from './state/transactions/updater'
import UserUpdater from './state/user/updater'
import ThemeProvider, { FixedGlobalStyle, ThemedGlobalStyle } from './theme'
import './i18n'

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

function getLibrary() {
  const connex = new Connex({
    node: 'https://testnet.veblocks.net/',
    network: 'test'
  })

  return connex
}

const GOOGLE_ANALYTICS_ID: string | undefined = process.env.REACT_APP_GOOGLE_ANALYTICS_ID

if (typeof GOOGLE_ANALYTICS_ID === 'string') {
  ReactGA.initialize(GOOGLE_ANALYTICS_ID, {
    gaOptions: {
      storage: 'none',
      storeGac: false
    }
  })
} else {
  ReactGA.initialize('test', { testMode: true, debug: true })
}

function Updaters() {
  return (
    <>
      <UserUpdater />
      <ApplicationUpdater />
      <TransactionUpdater />
      <WalletUpdater />
    </>
  )
}

ReactDOM.render(
  <>
    <FixedGlobalStyle />
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <Provider store={store}>
          <Updaters />
          <ThemeProvider>
            <>
              <ThemedGlobalStyle />
              <App />
            </>
          </ThemeProvider>
        </Provider>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  </>,
  document.getElementById('root')
)
