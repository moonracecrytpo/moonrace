import { useState } from 'react'
// import Link from 'next/link'

function SiteBanner (props) {
  const [hidden, setHidden] = useState(false)
  if (hidden) {
    return ''
  }

  return (
    <div className='banner d-flex flex-row'>
      <span className='ps-1' onClick={() => setHidden(true)}><i className='fa fa-times' /></span>
      <span className='flex-grow-1 text-center'>WARNING! Hedge has not been security audited and should only be used for testing purposes. We take no responsibility for any loss of funds or security issues.</span>
    </div>
  )
}

export default SiteBanner