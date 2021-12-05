import { Container, Col } from 'react-bootstrap'
import { connect } from 'react-redux'
import '../main.css';
import Discord from '../images/discord.svg';
import Twitter from '../images/twitter.svg';

// import Link from 'next/link'

function Footer ({ dispatch, usdSolPrice }) {
  return (
    <div className=''>
      <Container className=''>
        <footer className='footer'>
          <p className=''>MOONRACE 2021 - Infinity © </p>
          <a href="https://t.co/1QT72vk3Sf" target="_blank" rel="noreferrer"><img className="inline" src={Discord} width="30px" alt="discord"/></a>
          <a href="https://twitter.com/moonracecoin" target="_blank" rel="noreferrer"><img className="inline" src={Twitter} width="30px" height="45px" alt="twitter"/></a>

        </footer>
      </Container>
    </div>
  )
}
export default Footer