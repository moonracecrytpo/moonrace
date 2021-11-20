import NavBar from './NavBar'
import Footer from './Footer'
import SiteBanner from './SiteBanner'
import Background from '../images/moonrace_background.png';
import '../main.css';


export default function MainLayout (props) {
  return (
    <div className="main">
      <SiteBanner />
      <div>
        <main>
          {/* <NavBar showWallet variant='dark' /> */}
          <div className='py-3'>
            {props.children}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}