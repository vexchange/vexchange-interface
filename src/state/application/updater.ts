import { useEffect } from 'react'
import { useWeb3React } from '../../hooks'
import { updateBlockNumber } from './actions'
import { useDispatch } from 'react-redux'

export default function Updater() {
  const { library, chainId } = useWeb3React()
  const dispatch = useDispatch()

  // update block number
  useEffect(() => {
    if (library) {
      let stale = false

      const update = () => {
        library
          .thor
          .ticker()
          .next()
          .then(({ number: blockNumber }) => {
            if (!stale) {
              dispatch(updateBlockNumber({ networkId: chainId, blockNumber }))
            }
          })
          .catch(() => {
            if (!stale) {
              dispatch(updateBlockNumber({ networkId: chainId, blockNumber: null }))
            }
          })
      }

      update()
    }
  }, [dispatch, chainId, library])

  return null
}
