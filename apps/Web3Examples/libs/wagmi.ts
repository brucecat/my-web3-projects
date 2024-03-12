import { createClient, configureChains, goerli, Chain, mainnet } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { getDefaultWallets } from '@rainbow-me/rainbowkit'

const localChain: Chain = {
  id: 1337,
  name: 'Local',
  network: 'Local',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:7545']
    }
  }
}

const { chains, provider, webSocketProvider } = configureChains(
  [...(process.env.NEXT_PUBLIC_ENV === 'development' ? [localChain] : []), ...[goerli, mainnet]],
  [
    alchemyProvider({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY as string
    }),
    publicProvider()
  ]
)

const { connectors } = getDefaultWallets({
  appName: 'Noah DApp',
  chains
})

const client = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider
})

export { client, chains }
