import { InjectedConnector } from './InjectedConnector'

import { NetworkConnector } from './Network'

const NETWORK_URL = import.meta.env.VITE_NETWORK_URL

export const network = new NetworkConnector({
  urls: { [Number(import.meta.env.VITE_CHAIN_ID)]: NETWORK_URL }
})

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42]
})
