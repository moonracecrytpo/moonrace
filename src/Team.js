import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import React, { useCallback, useState, useEffect } from 'react';
import { Provider, Program } from '@project-serum/anchor'
import { getAirdropStatePubkey, MOONRACE_PROGRAM_ID} from './Constants.js';
import './main.css';

export function Team() {
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

    const [teamOne, setTeamOne] = useState(0);
    const [teamTwo, setTeamTwo] = useState(0);

    useEffect(() => {
        handleClick();
        // const intervalId = setInterval(() => {  //assign interval to a variable to clear it.
        //     console.log("hello")
        //     console.log(userWalletPublicKey)
        //     handleClick();

        // }, 5000)
        
        // return () => clearInterval(intervalId); //This is important
        
      }, [])

    // Create acc and claim
    const getTeam = useCallback(async () => {

        // Initialize program
        const program = await Program.at(new PublicKey(MOONRACE_PROGRAM_ID), provider)

        //derive all public keys
        const [airdropStateAccount, airdropbump] =  await getAirdropStatePubkey(program.programId);

        // get airdrop states
        const airdropState = await program.account.airdropState.fetch(airdropStateAccount)
        // Get allocations
        console.log(userWalletPublicKey)

        return [airdropState.blueTeamAvailToday.toString(), airdropState.redTeamAvailToday.toString()]


    }, [Wallet, connection, userWalletPublicKey]);

    const handleClick = async () => {
        // Create and sign transaction
        const team = await getTeam()
        setTeamOne(team[0])
        setTeamTwo(team[1])
        console.log('BLUE TEAM GETS:', teamOne)
        console.log('RED TEAM GETS:', teamTwo)
      }

    return (
    <div>
        <div className="teams">
            <div className="blue">
                <div className="team-label">Blue daily total airdrop</div>
                <div className="team-amount">{teamOne}</div>
            </div>
            <div className="orange">
                <div className="team-label">Orange daily total airdrop</div>
                <div className="team-amount">{teamTwo}</div>
            </div>
        </div>
        {/* <button onClick={handleClick} >
            TEAM ALLOCATIONS
        </button> */}
    </div>
    );
};