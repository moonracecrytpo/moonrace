import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, Transaction, sendAndConfirmRawTransaction } from '@solana/web3.js';
import React, { useCallback, useEffect, useState } from 'react';
import { Provider, Program } from '@project-serum/anchor'
import { getUserAirdropStatePubkey, getAirdropStatePubkey, getMoonraceAirdropPubKey, getMoonraceMintKey, MOONRACE_PROGRAM_ID} from './Constants.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, Token } from '@solana/spl-token'
import MoonLogo from './images/moon_logo.png';
import Countdown from "react-countdown";


const SplToken = require('@solana/spl-token')

export function Airdrop({moonraceBalance}) {
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const [timeRemaining, setTimeRemaining] = useState(0);
    const [isBusy, setBusy] = useState(true)


    // Connection and wallet
    const { connection } = useConnection()
    const { publicKey: userWalletPublicKey } = useWallet()
    const Wallet = useWallet()
    const provider = new Provider(connection, Wallet, {
        /** disable transaction verification step */
        skipPreflight: false,
        /** desired commitment level */
        commitment: 'confirmed',
        /** preflight commitment level */
        preflightCommitment: 'confirmed'
      })

      

    const getTimestamp = useCallback(async () => {
      const program = await Program.at(new PublicKey(MOONRACE_PROGRAM_ID), provider)
      const [airdropStateAccount, airdropbump] =  await getAirdropStatePubkey(program.programId);
      const airdropState = await program.account.airdropState.fetch(airdropStateAccount)
      const lastAirdropTimestamp = airdropState.lastAirdropResetTimestamp.toString()
      const lastAirdropDate = new Date(lastAirdropTimestamp * 1000)
      // Last aidrop date
      console.log('Last Airdrop:', lastAirdropDate)
      const diff = 86400000 - Math.abs(lastAirdropDate - new Date())
      setTimeRemaining(diff)
      console.log("AJHASJKH");
      console.log(diff);
      setBusy(false)
    }, []);

    useEffect(() => {
      getTimestamp() 
    }, [])

    // Create acc and claim
    const getTransaction = useCallback(async () => {
        const provider = await new Provider(connection, Wallet, {
            /** disable transaction verification step */
            skipPreflight: false,
            /** desired commitment level */
            commitment: 'confirmed',
            /** preflight commitment level */
            preflightCommitment: 'confirmed'
          })

        // Initialize program
        const program = await Program.at(new PublicKey(MOONRACE_PROGRAM_ID), provider)
        // Create a transaction
        const { blockhash } = await connection.getRecentBlockhash()
        const transaction = new Transaction({
            feePayer: userWalletPublicKey,
            recentBlockhash: blockhash
        })

        //derive all public keys
        const [userAirdropStateAccount, userairdropbump] =  await getUserAirdropStatePubkey(program.programId, provider.wallet.publicKey.toString());
        const [airdropStateAccount, airdropbump] =  await getAirdropStatePubkey(program.programId);
        const [moonraceAirdropAccount, tempbump3] =  await getMoonraceAirdropPubKey(program.programId);
        const [moonraceMint, tempbump] =  await getMoonraceMintKey(program.programId);

        // MOONRACE Public Key
        const moonraceAccountPublicKey = await Token.getAssociatedTokenAddress(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            moonraceMint,
            userWalletPublicKey
          )

        // Check if they have an airdrop account
        const airdropAccountInfo = await connection.getAccountInfo(userAirdropStateAccount)
        // Check 24 hours since last airdrop reset
        const airdropState = await program.account.airdropState.fetch(airdropStateAccount)
        const lastAirdropTimestamp = airdropState.lastAirdropResetTimestamp.toString()

        // Check if 24 hrs have passed or we are at the beginning
        const lastAirdropDate = new Date(lastAirdropTimestamp * 1000)
        // Last aidrop date
        console.log('Last Airdrop:', lastAirdropDate)
        const diff =  new Date() - lastAirdropDate > (24*60*60*1000)
        const canResetAirdrop = diff || (lastAirdropTimestamp == 0)

        // Create acc if none exists
        if (!airdropAccountInfo) {
          // Init User Aidrop account
            const initTx = new Transaction().add(
                await program.instruction.initUserAirdrop(
                    userairdropbump,{
                        accounts: {
                          signer: provider.wallet.publicKey,
                          systemProgram: SystemProgram.programId,
                          userAirdropState: userAirdropStateAccount,
                        },
                        signers: [provider.wallet.payer],
                      })
            )
            transaction.add(initTx)
        }

      // Reset airdrop if can be reset (global)
      if (canResetAirdrop) {
        const resetTx = new Transaction().add(
            await program.instruction.resetAirdrop({
                accounts: {
                  systemProgram: SystemProgram.programId,
                  airdropState: airdropStateAccount,
                },
                signers: [provider.wallet.payer],
              })
        )
        transaction.add(resetTx)
      }

      // airdrop
        const airdropTx = new Transaction().add(
            await program.instruction.airdrop({
                accounts: {
                  signer: provider.wallet.publicKey,
                  systemProgram: SystemProgram.programId,
                  userAirdropState: userAirdropStateAccount,
                  splTokenProgramInfo: SplToken.TOKEN_PROGRAM_ID,
                  airdropState: airdropStateAccount,
                  moonraceUserAccount: moonraceAccountPublicKey,
                  moonraceAirdropAccount: moonraceAirdropAccount,
                },
                signers: [provider.wallet.payer],
              })
        )
        // Add instruction to transaction
        transaction.add(airdropTx)
        return transaction;

    }, [Wallet, connection, userWalletPublicKey, provider]);

    const handleClick = async () => {
      try {
        // Create and sign transaction
        const transaction = await getTransaction()
        const stamp = await getTimestamp()
        console.log(stamp)
        const signedTransaction = await Wallet.signTransaction(transaction)
        await sendAndConfirmRawTransaction(connection, signedTransaction.serialize())
        setIsSuccess(true)
        setSuccessMessage("You're one step closer to the moon, lad!")
        setInterval(() => {  //assign interval to a variable to clear it.
            setIsSuccess(false)
        }, 5000)
        return () => clearInterval(0);
      } catch (error) {
        console.log("ERROR")
        setIsError(true)
        let errorMessage = error.message
        if (error.message === 'failed to send transaction: Transaction simulation failed: Error processing Instruction 0: invalid program argument') {
          errorMessage = "You have already claimed today's airdrop. Slow down moon man, wait for tomorrow!"
        }
        setErrorMessage(errorMessage)
        setInterval(() => {  //assign interval to a variable to clear it.
            setIsError(false)
        }, 5000)
        return () => clearInterval(0);
      }
    }

      // Renderer callback with condition
    const renderer = ({ hours, minutes, seconds, completed }) => {
      if (completed) {
        // Render a complete state
        return <span>TAKEOFF</span>;
      } else {
        // Render a countdown
        return (
          <span>
            {hours}:{minutes}:{seconds}
          </span>
        );
      }
    };

    return (
      <div className="main-layout">
            <div className="timer">
                <div className="next-airdrop">NEXT AIRDROP</div>
                <div className="timer-value">
                  {!isBusy &&
                    <Countdown date={Date.now() + timeRemaining} 
                      renderer={renderer} />
                  }
                </div>
            </div>

            <div className="next-drop">
                <div className="moon-logo">
                    <img src={MoonLogo} alt="moonlogo"/>
                </div>
                <div className="amount">
                    <div>{moonraceBalance}</div>
                    <div>YOUR $MOONRACE</div>
                </div>

            </div>
            <div className="claim">
                <div onClick={handleClick} className="claim-button">
                    CLAIM
                </div>
            </div>
            {isError && 
                <div className="error">
                    ERROR: {errorMessage}
                </div>
            }
            {isSuccess && 
                <div className="success">
                    SUCCESSS: {successMessage}
                </div>
            }
            
        </div>
    );
};