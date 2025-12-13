import { http, createConfig } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet, injected } from 'wagmi/connectors';

export const config = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    injected({
      target: 'metaMask',
    }),
    coinbaseWallet({
      appName: 'Hooked - Base Fishing Game',
      appLogoUrl: '/logo.png',
    }),
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
  ssr: true,
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
