import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { Wallet } from './Wallet';
import NextDrop from './components/NextDrop';
import MainLayout from './components/MainLayout';
import Presale from "./pages/Presale";
import Swap from "./pages/Swap";
import Home from "./pages/Home";
import {App} from "./App";

import {
    BrowserRouter as Router,
    Routes,
    Route,
    Switch,
    Link,
    Redirect,
  } from "react-router-dom";

// Use require instead of import, and order matters
require('@solana/wallet-adapter-react-ui/styles.css');
require('./index.css');

ReactDOM.render(
    <Router>
        <App />

        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Presale" element={<Presale />}>LINK</Route>
            <Route path="/Swap" element={<Swap />}>LINK</Route>
        </Routes>
    </Router>
,document.getElementById('root')
);