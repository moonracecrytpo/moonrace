import { Container, Col } from 'react-bootstrap'
import { connect } from 'react-redux'
// import Link from 'next/link'

function Footer ({ dispatch, usdSolPrice }) {
  return (
    <div className='footer'>
      <Container className=''>
        <footer className='d-flex flex-wrap justify-content-between align-items-center py-3 my-4'>
          <p className='col-md-4 mb-  0 text-muted'>MOONRACE 2021 - Infinity © </p>

        </footer>
      </Container>
    </div>
  )
}
export default Footer