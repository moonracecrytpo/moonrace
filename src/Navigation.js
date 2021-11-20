import { useWallet } from '@solana/wallet-adapter-react';
import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import React from 'react';
import MoonGif from './images/moon.gif';
import AlienGif from './images/alien.gif';

import './main.css';
import './home.css';

import {
    Link,
  } from "react-router-dom";


export const Navigation = () => {
    const { wallet } = useWallet();
    console.log(wallet);
    // const isSwap = window.location.pathname === '/Swap'

    return (
        <nav>
            <div className="logo">
                <img src={MoonGif} width="80px" alt="moonlogo"/>
                <img src={AlienGif} className="alien" width="45px" height="45px" alt="moonlogo"/>
                <h1 className="moonrace">MOONRACE</h1>
            </div>
            <div>
            <div className="nav-links">
                <div className="nav-link">
                    <Link style={{ textDecoration: 'none' }} to="/">
                    MOON
                    </Link>
                </div>
                <div className="nav-link">
                    <Link style={{ textDecoration: 'none' }}to="/Swap">BUY</Link>
                </div>
            </div>
                <WalletMultiButton />
                {wallet && <WalletDisconnectButton />}
            </div>
        </nav>
    );
};