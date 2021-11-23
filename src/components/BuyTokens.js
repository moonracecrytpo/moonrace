import { useState, useEffect } from 'react'
import '../main.css';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Presale } from '../Presale';
import { PublicKey } from '@solana/web3.js';
import { Provider, Program } from '@project-serum/anchor'
import { MOONRACE_PROGRAM_ID, getMoonraceConstPubkey } from '../Constants.js';
import ReactTooltip from "react-tooltip";


function BuyTokens ({usdBalance, solBalance, moonraceBalance}) {
    const [amount, setAmount] = useState(0);
    const [output, setOutput] = useState();


    const handleChange = async (value) => {
        // Create and sign transaction
        setAmount(value)
        let fixed = value / 0.0000050 * 0.99
        fixed = fixed.toFixed(2)
        setOutput(fixed);
      }


  return (
    <div className="buy-flex">
        <ReactTooltip />
        <div className='swap-container'>
        <div className="top-row">
            <div className='swap-title'>
                SWAP
            </div>
            <div data-tip="Moonrace uses a default 5% maximum slippage." className="details">
                ?
            </div>
        </div>
        <div className='top'>
            <div className="left">
                <div className="left-value">USDC</div>
                <div className="left-balance">Balance: {usdBalance} </div>
            </div>
            <div className="right">
                <div>
                    Max: 1000.45
                </div>  
                <div className="value">
                <input
                    name='amount'
                    type='number' 
                    value={amount}
                    onChange={e => handleChange(e.target.value)}
                />
                </div>  
            </div>
        </div>
        <div className='bottom'>
            <div className="left">
                <div className="left-value">MOONRACE</div>
                <div className="left-balance">Balance: {moonraceBalance}</div>
            </div>
            <div className="right">
                <div className="value">
                    {output}
                </div>  
            </div>      
        </div>
        <Presale amount={amount}/>

        </div>
    </div>
  )
}

export default BuyTokens