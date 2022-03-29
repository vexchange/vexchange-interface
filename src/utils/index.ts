import { Contract } from '@ethersproject/contracts'
import { getAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { find } from 'lodash'
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'
import { BigNumber } from '@ethersproject/bignumber'

import { abi as IVexchangeV2PairABI } from '../constants/abis/IVexchangeV2Pair.json'
import { abi as IVexchangeV2Router02ABI } from '../constants/abis/IVexchangeV2Router02.json'
import { ROUTER_ADDRESS } from '../constants'

import ERC20_ABI from '../constants/abis/erc20.json'
import { ChainId, JSBI, Percent, TokenAmount } from 'vexchange-sdk'
import { normalizeAccount } from '../context/normalizers'

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

export enum ERROR_CODES {
  TOKEN_SYMBOL = 1,
  TOKEN_DECIMALS = 2
}

const EXPLORE_PREFIXES: { [chainId in ChainId]: string } = {
  1: 'vechainstats',
  3: 'explore-testnet.'
}

export const userAccount = {
  get: (account: string) => {
    const savedAccount = localStorage.getItem('wallet')
    return savedAccount ? normalizeAccount(savedAccount) : account
  },
  set: (account: string) => {
    localStorage.setItem('wallet', account)
  },
  remove: () => {
    localStorage.removeItem('wallet')
    window.location.href = '/'
  }
}

export function getExploreLink(chainId: ChainId, data: string, type: 'transaction' | 'address'): string {
  const prefix = `https://${EXPLORE_PREFIXES[chainId] || EXPLORE_PREFIXES[1]}.com`

  switch (type) {
    case 'transaction': {
      return `${prefix}/transaction/${data}`
    }
    case 'address':
    default: {
      return `${prefix}/accounts/${data}`
    }
  }
}

export function getQueryParam(windowLocation: Location, name: string): string | undefined {
  const q = windowLocation.search.match(new RegExp('[?&]' + name + '=([^&#?]*)'))
  return q && q[1]
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address)
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

// add 10%
export function calculateGasMargin(value: BigNumber): BigNumber {
  return value.mul(BigNumber.from(10000).add(BigNumber.from(1000))).div(BigNumber.from(10000))
}

// converts a basis points value to a sdk percent
export function basisPointsToPercent(num: number): Percent {
  return new Percent(JSBI.BigInt(num), JSBI.BigInt(10000))
}

export function calculateSlippageAmount(value: TokenAmount, slippage: number): [JSBI, JSBI] {
  if (slippage < 0 || slippage > 10000) {
    throw Error(`Unexpected slippage value: ${slippage}`)
  }
  return [
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 - slippage)), JSBI.BigInt(10000)),
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 + slippage)), JSBI.BigInt(10000))
  ]
}

// account is not optional
export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked()
}

// account is optional
export function getProviderOrSigner(library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library
}

// account is optional
export function getContract(address: string, ABI: any, library: Web3Provider, account?: string): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  return new Contract(address, ABI, getProviderOrSigner(library, account))
}

// account is optional
export function getRouterContract(chainId, library, account) {
  return getContract(ROUTER_ADDRESS, IVexchangeV2Router02ABI, library, account)
}

// account is optional
export function getExchangeContract(pairAddress, library, account) {
  return getContract(pairAddress, IVexchangeV2PairABI, library, account)
}

// get token name
export async function getTokenName(tokenAddress, library) {
  if (!isAddress(tokenAddress)) {
    throw Error(`Invalid 'tokenAddress' parameter '${tokenAddress}'.`)
  }

  const abi = find(ERC20_ABI, { name: 'name' })
  const method = library.thor.account(tokenAddress).method(abi)

  return method
    .call()
    .then(({ decoded }) => decoded[0])
    .catch(error => {
      error.code = ERROR_CODES.TOKEN_SYMBOL
      throw error
    })
}

// get token symbol
export async function getTokenSymbol(tokenAddress, library) {
  if (!isAddress(tokenAddress)) {
    throw Error(`Invalid 'tokenAddress' parameter '${tokenAddress}'.`)
  }

  const abi = find(ERC20_ABI, { name: 'symbol' })
  const method = library.thor.account(tokenAddress).method(abi)

  return method
    .call()
    .then(({ decoded }) => decoded[0])
    .catch(error => {
      error.code = ERROR_CODES.TOKEN_SYMBOL
      throw error
    })
}

// get token decimals
export async function getTokenDecimals(tokenAddress, library) {
  if (!isAddress(tokenAddress)) {
    throw Error(`Invalid 'tokenAddress' parameter '${tokenAddress}'.`)
  }

  const abi = find(ERC20_ABI, { name: 'decimals' })
  const method = library.thor.account(tokenAddress).method(abi)

  return method
    .call()
    .then(({ decoded }) => Number(decoded[0]))
    .catch(error => {
      error.code = ERROR_CODES.TOKEN_DECIMALS
      throw error
    })
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}
