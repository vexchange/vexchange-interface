import { initializeConnector } from '@web3-react/core'
import { NufinetesConnector } from '@vimworld/nufinetes-link'

export const [nufinetes, hooks] = initializeConnector<NufinetesConnector>(
  actions =>
    new NufinetesConnector(actions, {
      // you should add rpc rules if you need nufi-link to acesss Evm chains
      rpc: []
    }),
  [818000000, 818000001]
)

// interfaces of rpc parameters array
interface BasicChainInformation {
  urls: string[] // an array of rpc urls
  name: string // name of the network
}
