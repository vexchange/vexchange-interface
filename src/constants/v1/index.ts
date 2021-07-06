import { ChainId } from 'vexchange-sdk'
import V1_EXCHANGE_ABI from './v1_exchange.json'
import V1_FACTORY_ABI from './v1_factory.json'

const V1_FACTORY_ADDRESSES: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x6A662F91E14312a11a2E35b359427AEf798fD928',
  [ChainId.TESTNET]: '0x5a6BB37E97dB359840c6A89AFBE0B09674b74e92'
}

export { V1_FACTORY_ADDRESSES, V1_FACTORY_ABI, V1_EXCHANGE_ABI }
