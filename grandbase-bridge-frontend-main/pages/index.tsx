import { useContext } from "react";
import type { NextPage } from 'next';
import Head from 'next/head';

import Header from './_components/Header';
import Footer from './_components/Footer';
import SwapSection from './_components/SwapSection';
import Spinner from './_components/Spinner';
import GlobalWeb3Context from "../_context/GlobalWeb3Context";

const Home: NextPage = () => {
  const { txLoading, loadingMsg } = useContext(GlobalWeb3Context);
  return (
    <div>
      <Head>
        <title>GrandBase Bridge</title>
        <meta content="GrandBase Bridge" name="description" />
        <link href="/favicon.ico" rel="icon" />
      </Head>
      {txLoading ? <div className="fixed z-[100] w-full h-full bg-black bg-opacity-80">
          <Spinner msg={loadingMsg}/>
      </div> : <></>}
      <div className="container flex mx-auto flex-col min-h-screen">
        <Header />
        <main className="w-full flex-grow flex items-center justify-center px-4">
          <SwapSection />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Home;
