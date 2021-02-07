import { ChainId, Token, VVET, JSBI, Percent } from '@uniswap/sdk'
import { injected } from '../connectors'

export const V1_FACTORY_ADDRESS = '0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95'

export const ROUTER_ADDRESS = '0x084b404b3A75e22Aa015b88eb160D22D3a81e719'

// used for display in the default list when adding liquidity
export const COMMON_BASES = {
  [ChainId.MAINNET]: [
    VVET[ChainId.MAINNET],
  ],
  [ChainId.ROPSTEN]: [VVET[ChainId.ROPSTEN]],
  [ChainId.RINKEBY]: [
    VVET[ChainId.RINKEBY],
  ],
  [ChainId.GÖRLI]: [VVET[ChainId.GÖRLI]],
  [ChainId.KOVAN]: [VVET[ChainId.KOVAN]]
}

const MAINNET_WALLETS = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  }
}

export const SUPPORTED_WALLETS =
  process.env.REACT_APP_CHAIN_ID !== '1'
    ? MAINNET_WALLETS
    : {
        ...MAINNET_WALLETS,
      }

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 15 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 15

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
// used for warning states
export const ALLOWED_SLIPPAGE_LOW: Percent = new Percent(JSBI.BigInt(100), JSBI.BigInt(10000))
export const ALLOWED_SLIPPAGE_MEDIUM: Percent = new Percent(JSBI.BigInt(500), JSBI.BigInt(10000))
export const ALLOWED_SLIPPAGE_HIGH: Percent = new Percent(JSBI.BigInt(1000), JSBI.BigInt(10000))
// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ETH
export const V1_TRADE_LINK_THRESHOLD = new Percent(JSBI.BigInt(50), JSBI.BigInt(10000))
