import { initializeConnector } from '@web3-react/core'
import { NufinetesConnector } from '@vimworld/nufinetes-link'
import { URLS } from '../../constants/chains'

export const [nufinetes, hooks] = initializeConnector<NufinetesConnector>(
  actions =>
    new NufinetesConnector(actions, {
      rpc: Object.keys(URLS).reduce((accumulator, chainId) => {
        accumulator[chainId] = URLS[Number(chainId)][0]
        return accumulator
      }, {})
    }),
  [818000000, 818000001]
)
