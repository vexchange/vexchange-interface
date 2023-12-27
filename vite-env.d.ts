/// <reference types="vite/client" />

interface Window {
  ethereum?: {
    isMetaMask?: true
    on?: (...args: any[]) => void
    removeListener?: (...args: any[]) => void
  }
  web3?: {}
  connex?: {
    vendor?: {
      sign?: (
        ...args: any[]
      ) => {
        comment?: (...args: any[]) => void
        request?: (...args: any[]) => Promise<void>
      }
    }
    thor?: {
      account?: (
        ...args: any[]
      ) => {
        method?: (...args: any[]) => void
      }
    }
  }
}
