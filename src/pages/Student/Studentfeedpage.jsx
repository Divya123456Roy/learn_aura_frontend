import React from 'react'
import StudentFeed from '../../components/StudentFeed'
import Navbar1 from '../../components/Navbar1'

function Studentfeedpage() {
  return (
   <>
   <div className='flex'>
       <Navbar1/>
   <StudentFeed/>
   </div>
   </>
  )
}

export default Studentfeedpage