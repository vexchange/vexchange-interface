import React from 'react'
import ReactDOM from 'react-dom'
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
