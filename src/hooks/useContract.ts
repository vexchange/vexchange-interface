import { Contract } from '@ethersproject/contracts'
import { ChainId } from 'vexchange-sdk'
import { abi as IVexchangeV2PairABI } from '../constants/abis/IVexchangeV2Pair.json'
import { useMemo } from 'react'
import ERC20_ABI from '../constants/abis/erc20.json'
import { MIGRATOR_ABI, MIGRATOR_ADDRESS } from '../constants/abis/migrator'
import { V1_EXCHANGE_ABI, V1_FACTORY_ABI, V1_FACTORY_ADDRESSES } from '../constants/v1'
import { getContract } from '../utils'
import { useWeb3React } from './index'

// returns null on errors
function useContract(address?: string, ABI?: any, withSignerIfPossible = true): Contract | null {
  const { library, account } = useWeb3React()

  return useMemo(() => {
    if (!address || !ABI || !library) return null
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account])
}

export function useV1FactoryContract(): Contract | null {
  const { chainId } = useWeb3React()
  return useContract(V1_FACTORY_ADDRESSES[chainId as ChainId], V1_FACTORY_ABI, false)
}

export function useV1ExchangeContract(address: string): Contract | null {
  return useContract(address, V1_EXCHANGE_ABI, false)
}

export function useV2MigratorContract(): Contract | null {
  return useContract(MIGRATOR_ADDRESS, MIGRATOR_ABI, true)
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible = true): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function usePairContract(pairAddress?: string, withSignerIfPossible = true): Contract | null {
  return useContract(pairAddress, IVexchangeV2PairABI, withSignerIfPossible)
}
