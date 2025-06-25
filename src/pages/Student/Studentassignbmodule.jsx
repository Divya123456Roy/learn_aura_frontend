import React from 'react'
import StudentAssignmentsByModule from '../../components/StudentAssignmentsByModule'
import Navbar1 from '../../components/Navbar1'

function Studentassignbmodule() {
  return (
   <>
   <div className='flex'>
           <Navbar1/>
   <StudentAssignmentsByModule/>
   </div>
   </>
  )
}

export default Studentassignbmodule