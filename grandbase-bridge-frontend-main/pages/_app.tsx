import { useEffect } from 'react';
import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from 'react-modal';

import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import type { AppProps } from 'next/app';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  mainnet,
  sepolia
} from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

import { GlobalWeb3Provider } from '../_context/GlobalWeb3Context';

const { chains, publicClient } = configureChains(
  [ 
    mainnet,
    // sepolia,
  ],
  [ alchemyProvider({apiKey: "V91xJ1bXOkvW5G4R3NTRYTkZYo9n7UXk"}), publicProvider() ]
);

const { connectors } = getDefaultWallets({
  appName: 'gbmigrator',
  projectId: '49cac464f1d7038f527c6170a1c54483',
  chains
})

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    Modal.setAppElement('#__next');
  }, []);

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <GlobalWeb3Provider>
          <Component {...pageProps} />
        </GlobalWeb3Provider>
      </RainbowKitProvider>
      <ToastContainer
        position="top-center"
        autoClose={10000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
      />
    </WagmiConfig>
  );
}

export default MyApp;
