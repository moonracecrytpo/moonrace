import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Keypair } from '@solana/web3.js';
import React, { useCallback, useState, useEffect } from 'react';

import { Provider, Program } from '@project-serum/anchor'
import { getMoonraceMintKey, MOONRACE_PROGRAM_ID, getTestUsdcMint } from './Constants.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, Token } from '@solana/spl-token'
import Refresh from './images/white_refresh.svg';
import Orange from './images/orange.gif';
import Blue from './images/blue.gif';


import './main.css';

export function Balance({childToParent}) {
    const [solBalance, setSolBalance] = useState(0);
    const [usdBalance, setUsdBalance] = useState(0);
    const [moonraceBalanceValue, setMoonraceBalance] = useState(0);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [address, setAddress] = useState("");
    const [team, setTeam] = useState("");


    // Connection and wallet
const { connection } = useConnection()
    const { publicKey: userWalletPublicKey } = useWallet()
    const Wallet = useWallet()

    useEffect(() => {
        if (userWalletPublicKey){
            handleClick();
        }
        const intervalId = setInterval(() => {  //assign interval to a variable to clear it.
        console.log(userWalletPublicKey)
        if (userWalletPublicKey){
            handleClick();
        }

        }, 5000)
        return () => clearInterval(intervalId);
    }, [userWalletPublicKey])

    // Solana balance
    const solanaBalance = useCallback(async () => {
        // Update wallet Sol Balance
        const balance = await connection.getBalance(userWalletPublicKey)
        return balance;
    }, [connection, userWalletPublicKey])

    const getPubKey = useCallback(async () => {
        const provider = new Provider(connection, Wallet, {
            /** disable transaction verification step */
            skipPreflight: false,
            /** desired commitment level */
            commitment: 'confirmed',
            /** preflight commitment level */
            preflightCommitment: 'confirmed'
        })
        return provider.wallet.publicKey.toString()
    });

    const usdcBalance = useCallback(async () => {
        const provider = new Provider(connection, Wallet, {
            /** disable transaction verification step */
            skipPreflight: false,
            /** desired commitment level */
            commitment: 'confirmed',
            /** preflight commitment level */
            preflightCommitment: 'confirmed'
          })
        let firstChar = provider.wallet.publicKey.toString().charCodeAt(0)
        let team = firstChar % 2;
        if (team === 0) {
            setTeam("orange");
        } else {
            setTeam("blue")
        }
          
        // Initialize program
        const program = await Program.at(new PublicKey(MOONRACE_PROGRAM_ID), provider)
        const [usdcMint, tempbump5] =  await getTestUsdcMint(program.programId);
        console.log("USDC MINT");
        console.log(usdcMint);
        

        // USDC Public Key
        const usdcAccountPublicKey = await Token.getAssociatedTokenAddress(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            usdcMint,
            userWalletPublicKey
        )

        const usdcToken = await new Token(
            connection,
            usdcMint,
            TOKEN_PROGRAM_ID,
            Keypair.generate()
        )

        // MOONRACE Account Info
        const usdcAccountInfo = await usdcToken.getAccountInfo(usdcAccountPublicKey)
        return usdcAccountInfo.amount.toNumber();

    }, [Wallet, connection, userWalletPublicKey]);

    // Moonrace balance
    const moonraceBalance = useCallback(async () => {
        const provider = new Provider(connection, Wallet, {
            /** disable transaction verification step */
            skipPreflight: false,
            /** desired commitment level */
            commitment: 'confirmed',
            /** preflight commitment level */
            preflightCommitment: 'confirmed'
          })

        // Initialize program
        const program = await Program.at(new PublicKey(MOONRACE_PROGRAM_ID), provider)
        const [moonraceMint, tempbump] =  await getMoonraceMintKey(program.programId);

        const moonraceAccountPublicKey = await Token.getAssociatedTokenAddress(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            moonraceMint,
            userWalletPublicKey
          )

        const moonraceToken = await new Token(
            connection,
            moonraceMint,
            TOKEN_PROGRAM_ID,
            Keypair.generate()
        )

        const moonraceAccountInfo = await moonraceToken.getAccountInfo(moonraceAccountPublicKey)

        // This account has no associated token account for this user
        if (!moonraceAccountInfo) {
            console.log('No MOONRACE account found');
        }

        return moonraceAccountInfo.amount.toNumber();
    }, [Wallet, connection, userWalletPublicKey]);

    const handleClick = async () => {

        try {
            // Create and sign transaction
            const solBalance = await solanaBalance()
            console.log('SOLANA BALANCE:', solBalance)
            let addy = await getPubKey()
            console.log(addy)
            setAddress(addy)
            let moonBalance = 0
            let usdBalance = 0
            try { 
                moonBalance = await moonraceBalance()
            } catch (e) {
                console.log(e)
                console.log("User has no $moonrace yet")
            }
            try { 
                usdBalance =  await usdcBalance()
            } catch (e) {
                console.log(e)
                console.log("User has no $moonrace yet")
            }
            setSolBalance(solBalance)
            setMoonraceBalance(moonBalance / 1000)
            setUsdBalance(usdBalance / 1000000)
            childToParent(solBalance, moonBalance / 1000, usdBalance / 1000000)
            setIsSuccess(true)
            setSuccessMessage("Balance refreshed!")
            setInterval(() => {
                setIsSuccess(false)
            }, 5000)
            return () => clearInterval(0);
        } catch (error) {
            console.log(error)
            setIsError(true)
            let errorMessage = error.message
            if (error.message === "Cannot read properties of null (reading 'toBase58')") {
              errorMessage = "Connect your wallet first, moon lad!"
            }
            setErrorMessage(errorMessage)
            setInterval(() => {
                setIsError(false)
            }, 5000)
            return () => clearInterval(0);
        }
    }

    return (
        <div>
        <div className="refresh">
            <img fill="white" width="30px" onClick={handleClick} src={Refresh} alt="moonlogo"/>
            <span>Refresh</span><span> Balance</span>
            
        </div>
        {team === "orange" &&
        <div className="orange-team-container teams">
            <div className="orange-team"> 
                <div>Team: {team} </div>
                <div className="address">Address: {address} </div>
            </div>
            <div>
                <img width="120px" src={Orange} alt="Orange team"/>
            </div>
        </div>
        }

        {team === "blue" && 
        <div className="blue-team-container teams">
            <div className="blue-team"> 
                <div> Team: {team} </div>
                <div className="address">Address: {address} </div>
            </div>
            <div>
                <img width="150px" src={Blue} alt="Blue team"/>
            </div>
        </div>    
        }
        {isError && 
            <div className="error">
                ERROR: {errorMessage}
            </div>
        }
        {/* {isSuccess && 
            <div className="success">
                SUCCESSS: {successMessage}
            </div>
        } */}
        </div>
    );

    
};