import { Token, ChainId } from 'vexchange-sdk/dist'
import { DUMMY_VET } from '..'

export default [
  DUMMY_VET[ChainId.TESTNET],
  new Token(ChainId.TESTNET, '0x0000000000000000000000000000456E65726779', 18, 'VTHO', 'VeThor')
]
