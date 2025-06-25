import React from 'react'
import CourseDetailsPage from '../../components/CourseDetailsPage'
import Navbar1 from '../../components/Navbar1'
import { useQuery } from '@tanstack/react-query'
import { fetchEnrolledCoursesAPI } from '../../services/courseAPI'
import { useParams } from 'react-router-dom'
import CourseContentPage from '../course/courseContentPage'

function Coursedetailspg() {

  const { courseId } = useParams()

  const {data,isLoading,isError,error} = useQuery({
    queryKey:['fetch-entrolled-courses'],
    queryFn:fetchEnrolledCoursesAPI
  })

  
  
  return(<>
  {data?.includes(courseId)  ? <div className='flex'>
    <Navbar1/>
    <CourseContentPage/>
    </div>: 
    <CourseDetailsPage/>}
  </>)
  
}

export default Coursedetailspg