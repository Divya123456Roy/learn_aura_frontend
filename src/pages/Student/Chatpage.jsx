import React from 'react'
 import ChatMessaging from '../../components/ChatMessaging'
import Navbar1 from '../../components/Navbar1'


function Chatpage() {
  return (
    <>

    <div className='flex'>
    <Navbar1/>
    <ChatMessaging/>
    
    </div>
    </>
  )
}

export default Chatpage