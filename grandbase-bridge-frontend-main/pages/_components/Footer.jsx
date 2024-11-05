import React from 'react';
import DiscordButton from './Icons/DiscordButton';
import TelegramButton from './Icons/TelegramButton';
import TwitterButton from './Icons/TwitterButton';

const Footer = () => {
  return (
    <div className="text-center p-10 sm:p-4 bottom-6">
      <div className="py-4 gap-x-4 flex flex-row justify-center">
        <TwitterButton href="https://twitter.com/grandbase_fi" target="_blank" />
        <DiscordButton href="https://discord.com/invite/grandbase" target="_blank" />
        <TelegramButton href="https://t.me/grandbase_fi" target="_blank" />
      </div>
      {/* <p className="text-[#c4bcbc] underline">Terms of use</p> */}
    </div>
  );
};

export default Footer;
