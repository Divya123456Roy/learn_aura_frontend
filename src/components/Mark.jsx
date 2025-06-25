import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Or your preferred API client
import { useParams } from 'react-router-dom';
import { fetchAllAssignmentDataAPI, gradeAssignmentAPI } from '../services/assignmentAPI';


const updateGrade = async ({ submissionId, grade, feedback }) => {
     // Only send fields that have values
     const payload = {};
     if (grade !== undefined && grade !== null) payload.grade = grade;
     if (feedback !== undefined && feedback !== null) payload.feedback = feedback; // Add feedback if needed

     // Make sure we don't send empty payload if only feedback is managed elsewhere
     if (Object.keys(payload).length === 0) {
         console.warn("Update grade called with no data to update.");
         // Optionally return early or throw an error depending on desired behavior
         // return null; // Or throw new Error("No data to update");
     }


    // Only send grade in this example
    const { data } = await apiClient.put(`/submissions/${submissionId}/grade`, { grade }); // ADJUST ENDPOINT & PAYLOAD
    return data;
};


const Mark = () => { // Receive assignmentId as prop
    const queryClient = useQueryClient();
    const [localGrades, setLocalGrades] = useState({}); // State to manage local input changes
    const {assignmentId} = useParams()


    // --- Data Fetching ---
    const { data: assignmentData, isLoading, error, isSuccess } = useQuery({
        queryKey: ["assignmentSubmissions", assignmentId], // Unique key including assignmentId
        queryFn: () => fetchAllAssignmentDataAPI(assignmentId),
        enabled: !!assignmentId, // Only run query if assignmentId is available
        staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    });

    // console.log(assignmentData);
    

    // --- Grade Update Mutation ---
    const gradeMutation = useMutation({
        mutationFn: gradeAssignmentAPI,
        onSuccess: (updatedSubmission) => {
            queryClient.invalidateQueries({ queryKey: ["assignmentSubmissions", assignmentId] });

            setLocalGrades(prev => {
                 const newState = {...prev};
                 // Find the studentId corresponding to the submissionId to clear the correct local state
                 const studentToUpdate = assignmentData?.students.find(s => s.submissionId === updatedSubmission._id);
                 if (studentToUpdate) {
                     delete newState[studentToUpdate.studentId];
                 }
                 return newState;
             });
        },
        onError: (err) => {
            console.error("Error updating grade:", err);
            alert(`Error updating grade: ${err.response?.data?.message || err.message}`);
        }
    });


    // --- Effect to initialize local grades when data loads ---
     useEffect(() => {
        if (isSuccess && assignmentData?.students) {
            const initialGrades = {};
            assignmentData.students.forEach(student => {
                // Initialize local state only if a submission exists
                if (student.submitted && student.submissionId) {
                     // Use studentId as key for local state consistency
                    initialGrades[student.studentId] = student.grade !== null && student.grade !== undefined ? String(student.grade) : '';
                }
            });
            setLocalGrades(initialGrades);
        }
    }, [isSuccess, assignmentData?.students]); // Re-run if data changes


    // --- Event Handlers ---
    const handleLocalGradeChange = (studentId, value) => {
         // Basic validation: allow empty string, numbers between 0-10
        if (value === '' || (/^\d{1,2}$/.test(value) && parseInt(value) >= 0 && parseInt(value) <= 10)) {
             setLocalGrades((prev) => ({
                 ...prev,
                 [studentId]: value,
             }));
         } else if (/^\d+$/.test(value) && parseInt(value) > 10) {
             // Handle case where user types > 10 temporarily
             setLocalGrades((prev) => ({
                 ...prev,
                 [studentId]: '10', // Cap at 10
             }));
         }
    };

    const handleGradeUpdate = (student) => {
        if (!student.submitted || !student.submissionId) {
            alert("Cannot update grade for an assignment that hasn't been submitted.");
            return;
        }
        const localGradeValue = localGrades[student.studentId];
        // Convert empty string to null, otherwise parse as float
        const gradeToSubmit = localGradeValue === '' ? null : parseFloat(localGradeValue);

        // Check if grade is actually a number or null before submitting
        if (localGradeValue !== '' && isNaN(gradeToSubmit)) {
             alert("Invalid grade value entered.");
             return;
         }

        console.log(`Updating grade for ${student.name} (Submission ID: ${student.submissionId}) to: ${gradeToSubmit}`);
        gradeMutation.mutate({
            submissionId: student.submissionId,
            grade: gradeToSubmit,
            // feedback: "Optional feedback here" // Add feedback if needed
        });
    };

    const handleViewAssignment = (studentName, assignmentLink) => {
        if (!assignmentLink) {
            alert(`No assignment submitted for ${studentName}.`);
            return;
        }
        window.open(assignmentLink, '_blank', 'noopener,noreferrer');
    };

    // --- Render Logic ---
    if (!assignmentId) {
        return <div className="p-8 text-center text-red-500">Error: Assignment ID is missing.</div>;
    }
    if (isLoading) {
        return <div className="p-8 text-center">Loading assignment data...</div>;
    }
    if (error) {
        return <div className="p-8 text-center text-red-500">Error loading data: {error.message}</div>;
    }
    if (!assignmentData) {
         return <div className="p-8 text-center">No data found for this assignment.</div>;
    }

    const { courseData, students } = assignmentData;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
            {/* Course Information Header */}
            <div className="bg-white shadow-lg rounded-xl p-6 sm:p-8 mb-6 w-full mx-auto transition-all duration-300 hover:shadow-xl">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                    {courseData?.courseName}
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-6">
                    {/* Module Info */}
                    <div className="flex items-start space-x-3">
                        <div className="text-blue-500 pt-1"> {/* Added pt-1 for alignment */}
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Module</p>
                            <p className="text-lg font-semibold text-gray-800">{courseData?.module}</p>
                        </div>
                    </div>
                    {/* Assignment Info */}
                    <div className="flex items-start space-x-3">
                        <div className="text-green-500 pt-1">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Assignment</p>
                            <p className="text-lg font-semibold text-gray-800">{courseData?.assignment}</p>
                        </div>
                    </div>
                     {/* Total Enrolled Info */}
                    <div className="flex items-start space-x-3">
                        <div className="text-purple-500 pt-1">
                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Enrolled</p>
                            <p className="text-lg font-semibold text-gray-800">{courseData?.totalEnrolled}</p>
                        </div>
                    </div>
                    {/* Total Submitted Info */}
                    <div className="flex items-start space-x-3">
                        <div className="text-orange-500 pt-1">
                           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Submitted</p>
                            <p className="text-lg font-semibold text-gray-800">{courseData?.totalSubmitted}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Student List */}
            <div className="bg-white shadow-md rounded-lg overflow-x-auto"> {/* Added overflow-x-auto */}
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-blue-700 text-white">
                        <tr>
                            <th className="px-6 py-4  text-center text-sm font-bold uppercase tracking-wider">Student Name</th>
                            {/* Removed "Assignment Submitted" Header */}
                            <th className="px-6 py-4  text-center text-sm font-bold uppercase tracking-wider">View Assignment</th>
                            <th className="px-6 py-4  text-center text-sm font-bold uppercase tracking-wider">Grade (/10)</th>
                            <th className="px-6 py-4  text-center text-sm font-bold uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {students && students.length > 0 ? (
                            students?.map((student) => (
                                <tr key={student.studentId}> {/* Use studentId as key */}
                                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800">{student.name}</td>
                                    {/* Removed "Assignment Submitted" Data Cell */}
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        {/* View Button: Enabled only if submitted */}
                                        <button
                                            onClick={() => handleViewAssignment(student.name, student.assignmentLink)}
                                            disabled={!student.submitted || !student.assignmentLink}
                                            className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white ${
                                                student.submitted && student.assignmentLink
                                                    ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                                                    : 'bg-gray-400 cursor-not-allowed'
                                            } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                                            title={student.submitted && student.assignmentLink ? "View submitted file" : "No submission to view"}
                                        >
                                             View 
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                        {/* Grade Input: Enabled only if submitted */}
                                        <input
                                            type="number" // Keep type="number" for browser controls, validation is manual
                                            min="0"
                                            max="10"
                                            // Use local state for value, fall back to empty string
                                            value={localGrades[student.studentId] ?? ''}
                                            onChange={(e) => handleLocalGradeChange(student.studentId, e.target.value)}
                                            disabled={!student.submitted || gradeMutation.isLoading} // Disable if not submitted or mutation is in progress
                                            className={`w-20 px-2 py-1 border rounded-md text-center text-sm ${
                                                student.submitted
                                                    ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                                    : 'border-gray-200 bg-gray-100 cursor-not-allowed'
                                            }`}
                                            placeholder={student.submitted ? "-" : "N/A"} // Placeholder indicates if grading is possible
                                        />
                                    </td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                        {/* Update Grade Button: Yellow, enabled only if submitted */}
                                        <button
                                            onClick={() => handleGradeUpdate(student)}
                                            disabled={!student.submitted || gradeMutation.isLoading || localGrades[student.studentId] === undefined} // Disable if not submitted, mutation loading, or no local grade set/changed
                                            className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white ${
                                                student.submitted
                                                    ? 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
                                                    : 'bg-gray-400 cursor-not-allowed'
                                            } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                                            title={student.submitted ? "Save the entered grade" : "Assignment not submitted"}
                                        >
                                           {gradeMutation.isLoading && gradeMutation.variables?.submissionId === student.submissionId ? 'Saving...' : 'Update Grade'}
                                        </button>
                                    </td>
                                </tr>
                            ))
                         ) : (
                             <tr>
                                 <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No students enrolled or data available.</td>
                             </tr>
                         )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Mark;