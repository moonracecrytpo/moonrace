import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import React, { useCallback, useState, useEffect } from 'react';
import { Provider, Program } from '@project-serum/anchor'
import { getAirdropStatePubkey, MOONRACE_PROGRAM_ID} from './Constants.js';
import './main.css';
import { ProgressBar } from './ProgressBar'

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
    const [teamOneRemaining, setTeamOneRemaining] = useState(0);
    const [teamTwoRemaining, setTeamTwoRemaining] = useState(0);

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

        return [airdropState.blueTeamAvailToday.toString(), airdropState.redTeamAvailToday.toString(), airdropState.blueTeamClaimed.toString(), airdropState.redTeamClaimed.toString() ]


    }, [Wallet, connection, userWalletPublicKey]);

    const handleClick = async () => {
        // Create and sign transaction
        const team = await getTeam()
        setTeamOne(parseInt(team[0]) / 1000)
        setTeamTwo(parseInt(team[1]) / 1000)
        console.log(parseInt(team[0]) / 1000)
        console.log(parseInt(team[1]) / 1000)
        console.log((parseInt(team[2]) / 1000))
        console.log((parseInt(team[3]) / 1000))

        setTeamOneRemaining((team[0] / 1000) - (parseInt(team[2]) / 1000))
        setTeamTwoRemaining((team[1] / 1000) - (parseInt(team[3]) / 1000))
        console.log('BLUE TEAM GETS:', teamOne)
        console.log('RED TEAM GETS:', teamTwo)
      }

    return (
    <div>
        <div className="teams">
            <div className="blue">
                <div className="blue-box">
                    <div className="team-label">Blue daily total airdrop</div>
                    <div className="team-amount">{teamOne}</div>
                </div>
                {/* <div className="team-label">Blue airdrop remaining</div> */}
                {/* <div className="team-amount">{teamOneRemaining}</div> */}
                <br />
                <div className="">Amount claimed: {(((teamOne - teamOneRemaining) / teamOne) * 100).toFixed(2) }%</div>

                {(teamOne - teamOneRemaining) / teamOne !== 0 && (teamOne - teamOneRemaining) / teamOne < 0.2 &&
                    <ProgressBar width={300} percent=".2" color="blue-progress"/>
                }   
                {(((teamOne - teamOneRemaining) / teamOne >= 0.2 && (teamOne - teamOneRemaining) / teamOne <= 1.01) || ((teamOne - teamOneRemaining) / teamOne === 0)) &&
                    <ProgressBar width={300} percent={(teamOne - teamOneRemaining) / teamOne } color="blue-progress"/>
                } 
                {((teamOne - teamOneRemaining) / teamOne > 1.01) &&
                    <ProgressBar width={300} percent={1} color="blue-progress"/>
                } 
            </div>
            <div className="orange">
                <div className="orange-box">
                    <div className="team-label">Orange daily total airdrop</div>
                    <div className="team-amount">{teamTwo}</div>
                </div>
                {/* <div className="team-label">Orange airdrop remaining</div> */}
                {/* <div className="team-amount">{teamTwoRemaining}</div> */}
                <br />
                <div className="">Amount claimed: {(((teamTwo - teamTwoRemaining) / teamTwo) * 100).toFixed(2) }%</div>
                {(teamTwo - teamTwoRemaining) / teamTwo !== 0 && (teamTwo - teamTwoRemaining) / teamTwo < 0.2 &&
                    <ProgressBar width={300} percent=".2" color="orange-progress"/>
                }   
                {(((teamTwo - teamTwoRemaining) / teamTwo >= 0.2 && (teamTwo - teamTwoRemaining) / teamTwo <= 1.01) || ((teamTwo - teamTwoRemaining) / teamOne === 0)) &&
                    <ProgressBar width={300} percent={(teamTwo - teamTwoRemaining) / teamTwo } color="blue-progress"/>
                } 
                {((teamTwo - teamTwoRemaining) / teamTwo > 1.01) &&
                    <ProgressBar width={300} percent={1} color="blue-progress"/>
                } 
            </div>
        </div>
        {/* <button onClick={handleClick} >
            TEAM ALLOCATIONS
        </button> */}
    </div>
    );
};