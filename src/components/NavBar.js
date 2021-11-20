import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
// import Link from 'next/link'
// import Image from 'next/image'
// import { useRouter } from 'next/router'
import classNames from 'classnames'
import { Dropdown, NavDropdown, Nav, Navbar, Container, Button } from 'react-bootstrap'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'

// import {
//   phantomConnectionThunk,
//   phantomNetworkThunk
// } from '../reducers/walletReducer'
// import { numberWithCommas } from '../lib/Utils'
// import SolanaCoin from '../public/solana-white.svg'
// import UsdhCoin from '../assets/coins/concept1.png'

function NavBar ({ dispatch, networkName, showWallet, variant, userSolBalance, userUsdhBalance }) {
//   const router = useRouter()
//   console.log('router.asPath', router.asPath)
  const { publicKey: userWalletPublicKey } = useWallet()

//   const setNetwork = (url, name) => {
//     dispatch(phantomNetworkThunk(url, name))
//   }

  return (
    <Navbar variant={variant}>
      <Container>
        {/* <Link href='/' passHref>
          <Navbar.Brand className='d-none d-md-flex align-items-center my-3'>
            <span className='fw-bold'>HEDGE</span>
          </Navbar.Brand>
        </Link>
        <Link href='/' passHref>
          <Navbar.Brand className='d-flex d-md-none align-items-center my-3 mx-auto'>
            <span className='fw-bold'>HEDGE</span>
          </Navbar.Brand>
        </Link> */}
        {/* <Nav className='d-none d-md-flex me-auto'>
          <NavDropdown title='More'>
            <Link href='/redeem' passHref>
              <NavDropdown.Item>Redeem</NavDropdown.Item>
            </Link>
            <Link href='/liquidate' passHref>
              <NavDropdown.Item>Liquidate</NavDropdown.Item>
            </Link>
            <Link href='/docs/intro' passHref>
              <NavDropdown.Item>Docs</NavDropdown.Item>
            </Link>
            <Link href='/docs/disclaimer' passHref>
              <NavDropdown.Item>Disclaimer</NavDropdown.Item>
            </Link>
          </NavDropdown>
        </Nav> */}
      </Container>
    </Navbar>
  )
}

function mapStateToProps (state) {
  const {
    networkUrl,
    networkName,
    userSolBalance,
    userUsdhBalance
  } = state.wallet
  return {
    networkUrl,
    networkName,
    userSolBalance,
    userUsdhBalance
  }
}
export default connect(mapStateToProps)(NavBar)

function NetworkDropdownItem (props) {
  const { currentNetwork, networkName, networkUrl, handleClick } = props
  const active = networkName === currentNetwork
  return (
    <NavDropdown.Item onClick={() => handleClick(networkUrl, networkName)} className={classNames({ 'bg-light': active })}>
      <span className={classNames({ 'fw-bold': active })}>{networkName}</span><br />
      <small><span className={classNames('text-muted', { 'fw-bold': active })}>{networkUrl}</span></small>
    </NavDropdown.Item>
  )
}