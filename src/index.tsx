import { createRoot } from 'react-dom/client'
import ReactGA from 'react-ga'
import { Web3ReactProvider, createWeb3ReactRoot } from './context'
import Connex from '@vechain/connex'
import { Provider } from 'react-redux'
import WebFont from 'webfontloader'
import { ChakraProvider, CSSReset } from '@chakra-ui/react'

import { NetworkContextName } from './constants'
import WalletUpdater from './state/wallet/updater'
import App from './pages/App'
import store from './state'
import ApplicationUpdater from './state/application/updater'
import TransactionUpdater from './state/transactions/updater'
import UserUpdater from './state/user/updater'

import './i18n'

import { theme } from './styles/theme'

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

WebFont.load({
  google: {
    families: ['Pixelify Sans']
  }
})

export function getLibrary() {
  const connex = new Connex({ node: 'https://mainnet.veblocks.net' })

  return connex
}

const GOOGLE_ANALYTICS_ID: string | undefined = import.meta.env.VITE_GOOGLE_ANALYTICS_ID

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

const root = createRoot(document.getElementById('root'))
root.render(
  <Web3ReactProvider getLibrary={getLibrary}>
    <Web3ProviderNetwork getLibrary={getLibrary}>
      <Provider store={store}>
        <Updaters />
        <ChakraProvider theme={theme}>
          <CSSReset />
          <App />
        </ChakraProvider>
      </Provider>
    </Web3ProviderNetwork>
  </Web3ReactProvider>
)
