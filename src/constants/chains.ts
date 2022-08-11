interface BasicChainInformation {
  urls: (string | undefined)[]
  name: string
}

export const CHAINS: {
  [chainId: number]: BasicChainInformation
} = {
  818000000: {
    urls: ['https://mainnet.veblocks.net/'],
    name: 'Vechain Mainnet'
  },
  818000001: {
    urls: ['https://testnet.veblocks.net/'],
    name: 'Vechain Testnet'
  }
}

export const URLS: { [chainId: number]: (string | undefined)[] } = Object.keys(CHAINS).reduce<{
  [chainId: number]: (string | undefined)[]
}>((accumulator, chainId) => {
  const validURLs: (string | undefined)[] = CHAINS[Number(chainId)].urls
  if (validURLs.length) {
    accumulator[Number(chainId)] = validURLs
  }
  return accumulator
}, {})
