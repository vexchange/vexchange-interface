import { ChainId, WVET, JSBI, Percent, Token } from 'vexchange-sdk'
import { injected } from '../connectors'

export const V1_FACTORY_ADDRESS = '0x6A662F91E14312a11a2E35b359427AEf798fD928'

export const ROUTER_ADDRESS = '0x6c0a6e1d922e0e63901301573370b932ae20dadb'

// used for display in the default list when adding liquidity
export const COMMON_BASES = {
  [ChainId.MAINNET]: [WVET[ChainId.MAINNET]],
  [ChainId.TESTNET]: [WVET[ChainId.TESTNET]]
}

const MAINNET_WALLETS = {
  SYNC: {
    connector: injected,
    name: 'Sync',
    iconName: 'sync-logo.svg',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  }
}

const VEX_ADDRESS = '0x0BD802635eb9cEB3fCBe60470D2857B86841aab6'
export const VEX: { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, VEX_ADDRESS, 18, 'VEX', 'Vexchange'),
  [ChainId.TESTNET]: new Token(ChainId.TESTNET, VEX_ADDRESS, 18, 'VEX', 'Vexchange')
}

export const SUPPORTED_WALLETS =
  process.env.REACT_APP_CHAIN_ID !== '1'
    ? MAINNET_WALLETS
    : {
        ...MAINNET_WALLETS
      }

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 15 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 15

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)
// used for warning states
export const ALLOWED_SLIPPAGE_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_SLIPPAGE_MEDIUM: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
export const ALLOWED_SLIPPAGE_HIGH: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ETH
export const V1_TRADE_LINK_THRESHOLD = new Percent(JSBI.BigInt(75), JSBI.BigInt(10000))
