const assert = require('assert');
const anchor = require('@project-serum/anchor');
const SplToken = require('@solana/spl-token')
const Web3 = require('@solana/web3.js')
const TOKEN_PROGRAM_ID = require('@solana/spl-token').TOKEN_PROGRAM_ID
const Token = require('@solana/spl-token').Token
const { SystemProgram, PublicKey, Transaction, Keypair, LAMPORTS_PER_SOL } = anchor.web3

//
export async function getMoonraceMintKey (programId) {
  const enc = new TextEncoder()
  const [findMintPublicKey, bump] = await PublicKey.findProgramAddress([enc.encode('moonrace')], programId)
  return [findMintPublicKey, bump]
}

export async function getTestUsdcMint (programId) {
  const enc = new TextEncoder()
  const [findMintPublicKey, bump] = await PublicKey.findProgramAddress([enc.encode('usdc')], programId)
  return [findMintPublicKey, bump]
}

export async function getUSDCPoolPubKey (programId) {
  const enc = new TextEncoder()
  const [findMintPublicKey, bump] = await PublicKey.findProgramAddress([enc.encode('usdcpool')], programId)
  return [findMintPublicKey, bump]
}

export async function getUSDCFundPubKey (programId) {
  const enc = new TextEncoder()
  const [findMintPublicKey, bump] = await PublicKey.findProgramAddress([enc.encode('usdcfund')], programId)
  return [findMintPublicKey, bump]
}

export async function getMoonracePoolPubKey (programId) {
  const enc = new TextEncoder()
  const [findMintPublicKey, bump] = await PublicKey.findProgramAddress([enc.encode('moonracepool')], programId)
  return [findMintPublicKey, bump]
}

export async function getMoonraceAirdropPubKey (programId) {
  const enc = new TextEncoder()
  const [findMintPublicKey, bump] = await PublicKey.findProgramAddress([enc.encode('moonraceairdrop')], programId)
  return [findMintPublicKey, bump]
}

export async function getAirdropStatePubkey (programId) {
  const enc = new TextEncoder()
  const [findMintPublicKey, bump] = await PublicKey.findProgramAddress([enc.encode('airdropstate')], programId)
  return [findMintPublicKey, bump]
}

export async function getUserAirdropStatePubkey (programId, pubkey) {
  const enc = new TextEncoder()
  const toEncode = pubkey.slice(0,32)
  const [findMintPublicKey, bump] = await PublicKey.findProgramAddress([enc.encode(toEncode)], programId)
  return [findMintPublicKey, bump]
}
