import { useState } from 'react'

function NextDrop (props) {
  const [hidden, setHidden] = useState(false)
  if (hidden) {
    return ''
  }

  return (
    <div className='banner d-flex flex-row'>
      <span className onClick={() => setHidden(true)}><i className='fa fa-times' /></span>
      <span className="next-drop">Next Drop</span>
    </div>
  )
}

export default NextDrop