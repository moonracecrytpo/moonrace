import { useWallet } from '@solana/wallet-adapter-react';
import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import React from 'react';
import MoonGif from './images/moon_logo.svg';
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
            <div className="full-nav">
            <div className="nav-links">
                 <Link style={{ textDecoration: 'none' }} to="/">
                    <div className="nav-link">
                        MOON
                    </div>
                </Link>

                <Link style={{ textDecoration: 'none' }}to="/Presale">
                    <div className="nav-link">
                        BUY
                    </div>
                </Link>
                {/* <Link style={{ textDecoration: 'none' }}to="/Swap">
                    <div className="nav-link">
                        SWAP
                    </div>
                </Link> */}
            </div>
                <WalletMultiButton />
                {wallet && <WalletDisconnectButton />}
            </div>
        </nav>
    );
};