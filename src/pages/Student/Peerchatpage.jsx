import React from 'react'
import PeerChat from '../../components/Peerchat'
import Navbar1 from '../../components/Navbar1'

function Peerchatpage() {
  return (
  <>
  <div className='flex'>
          <Navbar1/>
          
  <PeerChat/>
  </div>
  </>
  )
}

export default Peerchatpage