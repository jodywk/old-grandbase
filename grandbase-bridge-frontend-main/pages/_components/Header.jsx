import { ConnectButton } from '@rainbow-me/rainbowkit';
import WalletButton from './WalletButton';
import Logo from '../_assets/GrandBase_logo.svg';

const Header = () => {
  return (
    <header className="flex w-full items-center gap-x-4 px-6 py-6 sm:px-20 sm:py-10 header">
      <a
        className="text-primary relative mr-auto box-content flex shrink-0 items-center gap-2"
        href="https://v2-testnet.grandbase.io/"
        target="_blank"
      >
        <img className="h-8 md:h-12" src={Logo.src} alt="logo" />
      </a>
      <div className="z-30 flex items-center gap-x-4">
        {/* <WalletButton /> */}
        <ConnectButton />
      </div>
    </header>
  );
};

export default Header;
