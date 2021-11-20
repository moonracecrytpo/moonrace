import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
    getLedgerWallet,
    getPhantomWallet,
    getSlopeWallet,
    getSolflareWallet,
    getSolletExtensionWallet,
    getSolletWallet,
    getTorusWallet,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { Navigation } from './Navigation';
import { Send } from './Send';
import { Balance } from './Balance';
import { Buy } from './Buy';
import { Sell } from './Sell';
import { Airdrop } from './Airdrop';
import { Presale } from './Presale';
import { Team } from './Team';
import { Wallet } from './Wallet';
import React, { useMemo, useState } from 'react';
import SwapTokens from "./components/SwapTokens";


export const App = () => {
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const url = window.location.pathname
    let [solBalance, setSolBalance] = useState('');
    let [usdBalance, setUsdBalance] = useState('');
    let [moonraceBalance, setMoonraceBalance] = useState('');

    const childToParent = (child_sol_balance, child_moonrace_balance, child_usd_balance,) => {
        setSolBalance(child_sol_balance);
        setUsdBalance(child_usd_balance);
        setMoonraceBalance(child_moonrace_balance)
    }

    // @solana/wallet-adapter-wallets imports all the adapters but supports tree shaking --
    // Only the wallets you want to support will be compiled into your application
    const wallets = useMemo(
        () => [
            getPhantomWallet(),
            getSlopeWallet(),
            getSolflareWallet(),
            getTorusWallet({
                options: { clientId: 'Get a client ID @ https://developer.tor.us' },
            }),
            getLedgerWallet(),
            getSolletWallet({ network }),
            getSolletExtensionWallet({ network }),
        ],
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <Wallet className="wallet"/>

                    {/* <Send /> */}
                    <Balance childToParent={childToParent} />
                    <Buy />
                    {/* <Sell /> */}
                    <Airdrop moonraceBalance={moonraceBalance}/>
                    <SwapTokens usdBalance={usdBalance} solBalance={solBalance} moonraceBalance={moonraceBalance}/>
                    {/* {url === '/' &&
                        <Airdrop />
                    }
                    {url === '/Swap' &&
                        <SwapTokens isSwap />
                    }                     */}
                    <Team />
                    {/* {solBalance}
                    {moonraceBalance} */}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};