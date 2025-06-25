import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ContentViewer from '../../components/course/ContentViewer';
import CourseOverview from '../../components/course/CourseOverview';
import ContentSidebar from '../../components/course/ContentSidebar';




const CourseContentPage = () => {
    const { courseId } = useParams();
    const [selectedItem, setSelectedItem] = useState(null);
    const [checkSubmit, setCheckSubmit] = useState(false);
    const [checkQuizSubmit, setCheckQuizSubmit] = useState({ submitted: false, isCorrect: null, selectedAnswer: null, correctAnswer:null});

    return (
            <div className="min-h-screen bg-gray-50 font-sans flex flex-col md:flex-row w-full">
                <div className="flex-1 p-4 md:p-6 overflow-y-auto w-full md:max-h-screen flex flex-col space-y-4 md:space-y-6">
                    <ContentViewer courseId={courseId} 
                                   selectedItem={selectedItem} 
                                   checkSubmit={checkSubmit} 
                                   setCheckSubmit={setCheckSubmit}
                                   checkQuizSubmit = {checkQuizSubmit}
                                   setCheckQuizSubmit = {setCheckQuizSubmit} />
                    <CourseOverview courseId={courseId}  />
                </div>
                <ContentSidebar courseId={courseId} selectedItem={selectedItem} setSelectedItem ={setSelectedItem} />
            </div>
    );
};

export default CourseContentPage;