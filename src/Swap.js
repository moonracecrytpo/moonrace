import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Keypair, SystemProgram, Transaction } from '@solana/web3.js';
import React, { useCallback, useState } from 'react';
import { Provider, Program, BN } from '@project-serum/anchor'
import { getMoonraceMintKey, getTestUsdcMint, getUSDCPoolPubKey, getUSDCFundPubKey, getMoonracePoolPubKey,
    getMoonraceAirdropPubKey, getAirdropStatePubkey, getUserAirdropStatePubkey } from './util.js';

const Token = require('@solana/spl-token').Token
const SplToken = require('@solana/spl-token')
const TOKEN_PROGRAM_ID = require('@solana/spl-token').TOKEN_PROGRAM_ID

export const MOONRACE_PROGRAM_ID = '6dsJRgf4Kdq6jE7Q5cgn2ow4KkTmRqukw9DDrYP4uvij';

export const Swap = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const { wallet } = useWallet()
    console.log('WALLET', wallet)

    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [isSuccess, setIsSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    console.log("Ahhhhh shiiiiiiiet")
    const onClick = useCallback(async () => {
        if (!publicKey) throw new WalletNotConnectedError();
        console.log('pubkey:', publicKey.toString());

        const provider = new Provider(connection, wallet)
        console.log('PAYER', provider.wallet);

        const program = await Program.at(new PublicKey(MOONRACE_PROGRAM_ID), provider)
        console.log(program);

        const [usdcMint, tempbump5] =  await getTestUsdcMint(program.programId);

        //derive all public keys
        const [moonraceMint, tempbump] =  await getMoonraceMintKey(program.programId);
        const [usdcPoolAccount, tempbump1] =  await getUSDCPoolPubKey(program.programId);
        const [moonracePoolAccount, tempbump2] =  await getMoonracePoolPubKey(program.programId);
        const [moonraceAirdropAccount, tempbump3] =  await getMoonraceAirdropPubKey(program.programId);
        const [airdropStateAccount, airdropbump] =  await getAirdropStatePubkey(program.programId);
        const [userAirdropStateAccount, userairdropbump] =  await getUserAirdropStatePubkey(program.programId, publicKey.toString());
        const [usdcFundAccount, tempbump4] =  await getUSDCFundPubKey(program.programId);

        const moonraceToken = new Token(
            connection,
            moonraceMint,
            TOKEN_PROGRAM_ID,
            publicKey
          );

          const USDC = new Token(
            connection,
            usdcMint,
            TOKEN_PROGRAM_ID,
            publicKey
          );

          let usdc_user_account = await USDC.getOrCreateAssociatedAccountInfo(
            publicKey,
          )
          let UserUsdcAccount = await USDC.getAccountInfo(usdc_user_account.address);
          console.log('USDC ACC', UserUsdcAccount);

          let moonrace_user_account = await moonraceToken.getOrCreateAssociatedAccountInfo(
            publicKey,
          )
          let UserMoonraceAccount = await moonraceToken.getAccountInfo(moonrace_user_account.address);

        const transaction = new Transaction().add(
            await program.instruction.swap(
                new BN(3 * 10**6 * 1000),
                true,
                {
                    accounts: {
                        signer: provider.wallet.publicKey,
                        splTokenProgramInfo: SplToken.TOKEN_PROGRAM_ID,
                        systemProgram: SystemProgram.programId,
                        usdcUserAccount: UserUsdcAccount.address,
                        moonraceUserAccount: UserMoonraceAccount.address,
                        usdcPoolAccount: usdcPoolAccount,
                        usdcFundAccount: usdcFundAccount,
                        moonracePoolAccount: moonracePoolAccount,
                    },
                    signers: [provider.wallet.payer],
                }
            )
        );
        
        try {
            const signature = await sendTransaction(transaction, connection);
            await connection.confirmTransaction(signature, 'processed');
            setIsSuccess(true)
            setSuccessMessage("Your purchase was successful!")
            setInterval(() => {  //assign interval to a variable to clear it.
                setIsSuccess(false)
            }, 5000)
            return () => clearInterval(0);
        } catch (error) {
            console.log("ERROR")
            setIsError(true)
            setErrorMessage(error.message)
            setInterval(() => {  //assign interval to a variable to clear it.
                setIsError(false)
            }, 5000)
            return () => clearInterval(0);
        }
    }, [publicKey, sendTransaction, connection]);

    return (
        <div className='submit-btn' onClick={onClick} >
            BUY
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