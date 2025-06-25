import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Homepage from '../pages/Guest/Homepage';
import Loginpage from '../pages/Guest/Loginpage';
import Aboutpage from '../pages/Guest/Aboutpage';
import Servicepage from '../pages/Guest/Servicepage';
import Signuppage from '../pages/Guest/Signuppage';
import Forgotpwdpage from '../pages/Guest/Forgotpwdpage';
import Adminloginpage from '../pages/Admin/Adminloginpage';
import Admindashpage from '../pages/Admin/Admindashpage';
import Usermanagepage from '../pages/Admin/Usermanagepage';
import Groupmanagepage from '../pages/Admin/Groupmanagepage';
import Contentpage from '../pages/Admin/Contentpage';
import Platformpage from '../pages/Admin/Platformpage';
import Studypage from '../pages/Student/Studypage';
import Profilempage from '../pages/Student/Profilempage';
import Courselpage from '../pages/Student/Courselpage';
import Chatpage from '../pages/Student/Chatpage';
import Gamipage from '../pages/Student/Gamipage';
import Mentordashpage from '../pages/Professional/Mentordashpage';
import Progresstpage from '../pages/Professional/Progresstpage';
import Learningrpage from '../pages/Professional/Learningrpage';
import Grouppage from '../pages/Professional/Grouppage';
import Discussionpage from '../pages/Professional/Discussionpage';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Navbar1 from '../components/Navbar1';
import { useSelector } from 'react-redux';
import Navbar2 from '../components/Navbar2';
import Browsecoursepage from '../pages/Student/Browsecoursepage';
import Browsestudygpage from '../pages/Student/Browsestudygpage';
import Mystudygrouppage from '../pages/Student/Mystudygrouppage';
import Peerchatpage from '../pages/Student/Peerchatpage';
import Mentorchatpage from '../pages/Student/Mentorchatpage';
import Studygcpage from '../pages/Student/Studygcpage';
import Groupcaloabpage from '../pages/Student/Groupcaloabpage';
import Mentorshippage from '../pages/Professional/Mentorshippage';
import Notificationpage from '../pages/Professional/Notificationpage';
import Pagegroup from '../pages/Student/Pagegroup';
import Studentfeedpage from '../pages/Student/Studentfeedpage';
import Courselistpage from '../pages/Professional/Courselistpage';
import Modulelistpage from '../pages/Professional/Modulelistpage';
import Courseformpage from '../pages/Professional/Courseformpage';
import Moduleformpage from '../pages/Professional/Moduleformpage';
import Unitformpage from '../pages/Professional/Unitformpage';
import Assignformpage from '../pages/Professional/Assignformpage';
import Searchuserpage from '../pages/Student/Searchuserpage';
// import Chatprofpage from '../pages/Professional/Chatprofpage';
import Mentorpage from '../pages/Professional/Mentorpage';
import Createassignpage from '../pages/Professional/Createassignpage';
import Viewassignpage from '../pages/Professional/Viewassignpage';
import Assignbcoursepg from '../pages/Professional/Assignbcoursepg';
import Assignbmodulepg from '../pages/Professional/Assignbmodulepg';
import Gradeassignpg from '../pages/Professional/Gradeassignpg';
import Studentassignpg from '../pages/Student/Studentassignpg';
import Sallasignspg from '../pages/Student/Sallasignspg';
import Studassignbcoursepg from '../pages/Student/Studassignbcoursepg';
import Studentassignbmodule from '../pages/Student/Studentassignbmodule';
import Adminstudviewpg from '../pages/Admin/Adminstudviewpg';
import Adminprofview from '../pages/Admin/Adminprofview';
import CourseDetails from '../components/CourseDetails';
import ModuleList from '../components/ModuleList';
import Professionalprofilepg from '../pages/Professional/Professionalprofilepg';
import Quizpage from '../pages/Professional/Quizpage';
import Groupdetailpg from '../pages/Professional/Groupdetailpg';
import PostPage from '../components/PostPage';
import ReplyForm from '../components/ReplyForm';
import Friendreqpg from '../pages/Student/Friendreqpg';
import Viewunitpg from '../pages/Professional/Viewunitpg';
import ViewQuiz from '../components/ViewQuiz';
import Coursedetailspg from '../pages/Student/Coursedetailspg';
import CourseContentPage from '../components/CourseContentPage';

import PaymentSuccess from '../pages/PaymentSuccess';
import PaymentFail from '../pages/PaymentFailure';
import Reqfriendpg from '../pages/Professional/Reqfriendpg';
import Profchatpg from '../pages/Professional/Profchatpg';
import SearchGroup from '../components/SearchGroup';
import Coursedetpg from '../pages/Professional/Coursedetpg';
import Proffriendreqpg from '../pages/Professional/Proffriendreqpg';
import Dashboardpg from '../pages/Admin/Dashboardpg';
import Mark from '../components/Mark';
import Notifications from '../components/Notifications';
import Notificationspg from '../pages/Student/Notificationspg';
import Certificate from '../components/Certificate';
import Discdetailspg from '../pages/Student/Discdetailspg';
import Searchgrouppg from '../pages/Student/Searchgrouppg';



function Index() {

    const user = useSelector((state) => state.auth)

    return (
        <BrowserRouter>
            {/* {user.role==="student" ?<Navbar1/> : user.role ==="professional"? <Navbar2/> : user.role ==="admin"? <Navbar/> : <Navbar1/>} */}

            <Routes>
                {/* Guest Routes */}

                <Route path="/" element={<Homepage />} />
                <Route path="/login" element={<Loginpage />} />
                <Route path="/about" element={<Aboutpage />} />
                <Route path="/services" element={<Servicepage />} />
                <Route path="/signup" element={<Signuppage />} />
                <Route path="/forgot-password" element={<Forgotpwdpage />} />

                {/* Admin Routes */}
                <Route path="/admin">
                    <Route path="admin-login" element={<Adminloginpage />} />
                    <Route path="admin-dashboard" element={<Admindashpage />} />
                    <Route path="user-management" element={<Usermanagepage />} />
                    <Route path="student-view" element={<Adminstudviewpg />} />
                    <Route path="professional-view" element={<Adminprofview />} />
                    <Route path="group-management" element={<Groupmanagepage />} />
                    <Route path="content-moderation" element={<Contentpage />} />
                    <Route path="platform-analytics" element={<Platformpage />} />
                    <Route path="view-all" element={<Dashboardpg />} />
                </Route>

                {/* Student Routes */}
                <Route path="/student">
                    <Route path="feed" element={<Studentfeedpage />} />
                    <Route path="post" element={<PostPage />} />
                    <Route path="reply" element={<ReplyForm />} />
                    <Route path="profile" element={<Profilempage />} />
                    <Route path="search-users" element={<Searchuserpage />} />
                    <Route path="group" element={<Studypage />} />
                    <Route path="student-assignment" element={<Studentassignpg />} />
                    <Route path="view-assignments" element={<Sallasignspg />} />
                    <Route path="stud-assign-course" element={<Studassignbcoursepg />} />
                    <Route path="stud-assign-module" element={<Studentassignbmodule />} />
                    <Route path="group-page/:groupId" element={<Pagegroup />} />
                    <Route path="course-library" element={<Courselpage />} />
                    <Route path="browse-study" element={<Browsestudygpage />} />
                    <Route path="notifications" element={<Notificationspg />} />
                    <Route path="course/:courseId" element={<Coursedetailspg />} />
                    <Route path="certificate/:courseId" element={<Certificate />} />
                    <Route path="my-studygroup" element={<Mystudygrouppage />} />
                    <Route path="create-group" element={<Groupcaloabpage />} />
                    <Route path="browse-course" element={<Browsecoursepage />} />
                    <Route path="chat-messaging" element={<Chatpage />} />
                    <Route path="peer-chat" element={<Peerchatpage />} />
                    <Route path="mentor-chat" element={<Mentorchatpage />} />
                    <Route path="study-group-chat" element={<Studygcpage />} />
                    <Route path="gamification" element={<Gamipage />} />
                    <Route path="friend-request" element={<Friendreqpg />} />
                    <Route path="search-group" element={<Searchgrouppg />} />
                    <Route path="discussion/:id" element={<Discdetailspg />} />
                </Route>

                {/* Professional Routes */}
                <Route path="/professional">
                    <Route path="" element={<Mentordashpage />} />
                    <Route path="profile" element={<Professionalprofilepg />} />
                    <Route path="login" element={<Mentorpage />} />
                    <Route path="notification" element={<Notificationpage />} />
                    <Route path="chat" element={<Profchatpg />} />
                    <Route path="courses" element={<Courselistpage />} />
                    <Route path="create-course" element={<Courseformpage />} />
                    <Route path="my-resourses" element={<Learningrpage />} />
                    <Route path="create-group" element={<Grouppage />} />
                    <Route path="view-group" element={<Groupdetailpg />} />
                    <Route path="create-discussion" element={<Discussionpage />} />
                    {/* <Route path="requests" element={<Mentorshippage />} /> */}
                    <Route path=":id/course" element={<Coursedetpg />} />
                    <Route path=":studentId/progress" element={<Progresstpage />} />
                    <Route path=":courseId/create-module" element={<Moduleformpage />} />
                    <Route path=":courseId/module" element={<><Navbar2/><ModuleList /></>} />
                    <Route path="prof-list" element={<Reqfriendpg />} />
                    <Route path="prof-friend" element={<Proffriendreqpg />} />
                    <Route path=":courseId/assignment-manager" element={<Assignbcoursepg />} />
                    <Route path=":courseId/:moduleId/assignments" element={<Assignbmodulepg />} />
                    <Route path=":courseId/:moduleId/create-quiz" element={<Quizpage />} />
                    <Route path=":courseId/:moduleId/view-quiz" element={<><Navbar2/><ViewQuiz /></>} />
                    <Route path=":courseId/:moduleId/create-unit" element={<Unitformpage />} />
                    <Route path=":courseId/:moduleId/view-unit" element={<Viewunitpg />} />
                    <Route path=":courseId/:moduleId/assignment" element={<Assignformpage />} />
                    <Route path=":courseId/:moduleId/create-assignment" element={<Createassignpage />} />
                    <Route path=":courseId/:moduleId/assignment/view-assignment" element={<><Navbar2/><Viewassignpage /></>} />
                    <Route path=":courseId/:moduleId/:assignmentId/mark" element={<><Navbar2/><Mark /></>} />
                    <Route path=":courseId/:moduleId/:assignmentId/grade" element={<Gradeassignpg />} />
                    {/* <Route path="chat-prof" element={<Chatprofpage/>} /> */}
                </Route>
                <Route path="/payment">
                <Route path="success" element={<PaymentSuccess />} />
                <Route path="failure" element={<PaymentFail />} />
                </Route>
            </Routes>
            
        </BrowserRouter>
    );
}

export default Index;
