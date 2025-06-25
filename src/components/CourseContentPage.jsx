import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaChevronDown, FaChevronUp, FaPlay, FaFileAlt, FaQuestionCircle, FaCheckCircle } from 'react-icons/fa';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCourseContentAPI, markItemAsCompleteAPI, submitAssignmentAPI, submitQuizAPI } from '../services/courseAPI';
import { checkAssignmentSubmittedAPI, checkQuizSubmittedAPI } from '../services/assignmentAPI';

const CourseContentPage = () => {
    const { courseId } = useParams();
    const [selectedItem, setSelectedItem] = useState(null);
    const [expandedModule, setExpandedModule] = useState(null);
    const [showTextFallback, setShowTextFallback] = useState(false);
    const [localProgress, setLocalProgress] = useState(0);
    const [showSubmitAssignment, setShowSubmitAssignment] = useState(false);
    const [showSubmitQuiz, setShowSubmitQuiz] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null); // For assignments
    const [selectedAnswer, setSelectedAnswer] = useState(''); // For quizzes
    const [checkSubmit, setCheckSubmit] = useState(false); // Assignment submission status
    const [checkQuizSubmit, setCheckQuizSubmit] = useState({ submitted: false, message: null, isCorrect: null }); // Enhanced quiz status


    const queryClient = useQueryClient();

    // Calculate Course Progress (same as before)
    const calculateCourseProgress = (currentModules) => {
        // ... (implementation remains the same)
        if (!currentModules || currentModules.length === 0) return 0;
        let completedItems = 0;
        let totalItems = 0;
        currentModules.forEach((module) => {
            totalItems += module.units?.length || 0;
            completedItems += module.units?.filter((unit) => unit.completed).length || 0;
            totalItems += module.assignments?.length || 0;
            completedItems += module.assignments?.filter((assignment) => assignment.completed).length || 0;
            totalItems += module.quizzes?.length || 0;
            completedItems += module.quizzes?.filter((quiz) => quiz.completed).length || 0;
        });
        return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    };

    // Check Assignment Submission Status when selectedItem changes
    useEffect(() => {
        const fetchAssignmentStatus = async () => {
            if (selectedItem?._id && selectedItem?.type === 'assignment') {
                try {
                    // Optional: Add loading state specific to this check if needed
                    const data = await checkAssignmentSubmittedAPI({ assignmentId: selectedItem._id });
                    setCheckSubmit(data?.response === true);
                } catch (error) {
                    console.error("Error checking assignment status:", error);
                    setCheckSubmit(false); // Assume not submitted on error
                }
            } else {
                setCheckSubmit(false); // Reset if not an assignment
            }
        };
        fetchAssignmentStatus();
    }, [selectedItem]); // Re-run only when selectedItem changes

    // Check Quiz Submission Status when selectedItem changes
    useEffect(() => {
        const fetchQuizStatus = async () => {
            if (selectedItem?._id && selectedItem?.type === 'quiz') {
                try {
                    // Optional: Add loading state specific to this check if needed
                    const data = await checkQuizSubmittedAPI({ quizId: selectedItem._id });
                     // Assuming API returns { response: boolean, message?: string, isCorrect?: boolean }
                    setCheckQuizSubmit({
                        submitted: data?.response === true,
                        message: data?.message || null, // Store message if available
                        isCorrect: data?.isCorrect // Store correctness if available
                     });
                } catch (error) {
                    console.error("Error checking quiz status:", error);
                    setCheckQuizSubmit({ submitted: false, message: null, isCorrect: null }); // Reset on error
                }
            } else {
                 setCheckQuizSubmit({ submitted: false, message: null, isCorrect: null }); // Reset if not a quiz
            }
        };
        fetchQuizStatus();
    }, [selectedItem]); // Re-run only when selectedItem changes


    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['fetch-course', courseId],
        queryFn: () => getCourseContentAPI(courseId),
        onSuccess: (data) => {
             // ... (onSuccess logic remains the same)
            if (data?.modules) {
                setLocalProgress(calculateCourseProgress(data.modules));
            }
             // Set initial item (if needed)
             if (!selectedItem && data?.modules?.[0]) {
                 const firstModule = data.modules[0];
                 const firstItem = firstModule.units?.[0] || firstModule.assignments?.[0] || firstModule.quizzes?.[0];
                 if (firstItem) {
                     const itemType = firstModule.units?.includes(firstItem) ? 'unit' :
                                      firstModule.assignments?.includes(firstItem) ? 'assignment' : 'quiz';
                     setSelectedItem({ ...firstItem, type: itemType });
                 }
             }
        },
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const course = data?.course;
    const modules = data?.modules || [];

    // --- Mutations (Mark Complete, Submit Assignment, Submit Quiz) ---
    // Mark Complete Mutation (using optimistic updates)
     const markCompleteMutation = useMutation({
        mutationFn: markItemAsCompleteAPI,
        onSuccess: (data, variables) => { // Added data, variables
            queryClient.invalidateQueries({ queryKey: ['fetch-course', courseId] });
            // Optional: If backend response confirms completion, update local state
             if (variables.completed && data?.success) { // Check if we were marking as complete
                 // Update local state if necessary, though invalidateQueries should handle it
             }
        },
        onError: (err, variables, context) => {
            console.error("Error marking item complete:", err);
             alert(`Failed to update completion status for ${variables.type}. Please try again.`);
            // Rollback optimistic update
            if (context?.previousData) {
                queryClient.setQueryData(['fetch-course', courseId], context.previousData);
                // Recalculate progress based on rolled-back data
                setLocalProgress(calculateCourseProgress(context.previousData.modules));
            }
        },
         onMutate: async (variables) => {
             const { itemId, type, completed } = variables;
             await queryClient.cancelQueries({ queryKey: ['fetch-course', courseId] });
             const previousData = queryClient.getQueryData(['fetch-course', courseId]);

             if (previousData) {
                 const updatedModules = previousData.modules.map(module => ({
                     ...module,
                     units: module.units?.map(item => item._id === itemId ? { ...item, completed } : item),
                     assignments: module.assignments?.map(item => item._id === itemId ? { ...item, completed } : item),
                     quizzes: module.quizzes?.map(item => item._id === itemId ? { ...item, completed } : item),
                 }));

                 // Optimistically update the cache
                 queryClient.setQueryData(['fetch-course', courseId], { ...previousData, modules: updatedModules });

                 // Optimistically update the progress bar
                 setLocalProgress(calculateCourseProgress(updatedModules));
             }
             // Return context for potential rollback
             return { previousData };
         },
    });

    // Submit Assignment Mutation
    const submitAssignmentMutation = useMutation({
        mutationFn: submitAssignmentAPI,
        onSuccess: (data) => { // Assuming API returns { success: boolean } or similar
            console.log("Assignment submitted successfully", data);
            queryClient.invalidateQueries({ queryKey: ['fetch-course', courseId] }); // Refetch course data
            setShowSubmitAssignment(false); // Hide form
            setSelectedFile(null); // Clear selected file
            setCheckSubmit(true); // Set submitted status locally immediately

            // Optional: Automatically mark assignment as complete on successful submission
            if (selectedItem && selectedItem.type === 'assignment' && !selectedItem.completed) {
                 markCompleteMutation.mutate({
                     courseId,
                     itemId: selectedItem._id,
                     type: 'assignment',
                     completed: true
                 });
             }
        },
        onError: (err) => {
            console.error("Error submitting assignment:", err);
            // More specific error message if possible
            const message = err.response?.data?.message || err.message || "Failed to submit assignment. Please try again.";
            alert(message);
            // Keep form open on error? Or close it? Depends on desired UX.
             // setShowSubmitAssignment(false);
             // setSelectedFile(null);
        },
    });


    // Submit Quiz Mutation
    const submitQuizMutation = useMutation({
        mutationFn: submitQuizAPI,
        onSuccess: (data) => {
            console.log("Quiz submitted successfully", data);
            queryClient.invalidateQueries({ queryKey: ['fetch-course', courseId] }); // Refetch course data
            setShowSubmitQuiz(false); // Hide form
            setSelectedAnswer(''); // Clear selected answer
            // Update local quiz submission status based on response
             setCheckQuizSubmit({
                 submitted: true,
                 message: data?.message || "Submission processed.",
                 isCorrect: data?.isCorrect
             });

            // Optional: Automatically mark quiz as complete only if the answer is correct
            if (selectedItem && selectedItem.type === 'quiz' && !selectedItem.completed && data?.isCorrect) {
                 markCompleteMutation.mutate({
                     courseId,
                     itemId: selectedItem._id,
                     type: 'quiz',
                     completed: true
                 });
             } else if (selectedItem && selectedItem.type === 'quiz' && !selectedItem.completed && !data?.isCorrect) {
                 // Maybe show a message that it needs to be correct to be marked complete?
                 // Or allow manual completion regardless? Current logic requires correctness.
                 alert("Quiz submitted, but the answer was incorrect. It won't be marked as complete automatically.");
             }
        },
        onError: (err) => {
            console.error('Error submitting quiz:', err);
             const message = err.response?.data?.message || err.message || "Failed to submit quiz. Please try again.";
             alert(message);
            // Keep form open? Or close?
            // setShowSubmitQuiz(false);
            // setSelectedAnswer('');
        },
    });

    // --- Event Handlers ---
    const toggleModule = (moduleId) => {
        setExpandedModule(expandedModule === moduleId ? null : moduleId);
    };

    const handleItemClick = (item) => {
        // Add null check for item
        if (!item) return;
        setSelectedItem(item);
        // Reset states specific to item type display
        setShowTextFallback(false);
        setShowSubmitAssignment(false);
        setShowSubmitQuiz(false);
        setSelectedFile(null);
        setSelectedAnswer('');
        // No need to reset checkSubmit/checkQuizSubmit here, useEffect handles it
    };

    const handleCheckboxChange = (item) => {
        if (!item || !item._id || !item.type) {
            console.error("Invalid item passed to handleCheckboxChange:", item);
            return;
        }
        const newCompletedStatus = !item.completed;
         // Add confirmation for unchecking? Optional.
         // if (!newCompletedStatus && !window.confirm("Are you sure you want to mark this item as incomplete?")) {
         //     return;
         // }

        markCompleteMutation.mutate({
            courseId,
            itemId: item._id,
            type: item.type,
            completed: newCompletedStatus
        });
    };

    const handleFileChange = (event) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file && file.type === 'application/pdf') {
            setSelectedFile(file);
        } else {
            setSelectedFile(null);
            alert("Please select a PDF file.");
        }
    };

    const handleAnswerChange = (event) => {
        setSelectedAnswer(event.target.value);
    };

    const handleAssignmentSubmit = async () => {
        if (!selectedFile || !selectedItem?._id || selectedItem.type !== 'assignment') {
            alert("Please select a PDF file before submitting.");
            return;
        }
        // Check if already submitted (client-side check)
         if (checkSubmit) {
             alert("Assignment has already been submitted.");
             return;
         }

        const formData = new FormData();
        formData.append('assignmentFile', selectedFile);
        formData.append('courseId', courseId);
        formData.append('assignmentId', selectedItem._id);

        await submitAssignmentMutation.mutateAsync(formData);
    };

    const handleQuizSubmit = async () => {
        if (!selectedAnswer || !selectedItem?._id || selectedItem.type !== 'quiz') {
            alert('Please select an answer before submitting.');
            return;
        }
        // Check if already submitted (client-side check)
        if (checkQuizSubmit.submitted) {
             alert("Quiz has already been submitted.");
             return;
         }

        await submitQuizMutation.mutateAsync({
            courseId,
            quizId: selectedItem._id,
            selectedAnswer
        });
    };

    // --- Render Content Function ---
    const renderContent = (item) => {
        const contentContainerClass = 'min-h-[30vh] max-h-[40vh] overflow-auto p-1'; // Adjusted height

        if (!item) return <p className="text-gray-500 p-4">Select an item from the course content list to view its details.</p>;

        // --- Quiz Rendering ---
        if (item.type === 'quiz') {
            const quizContent = item.content || { questionText: item.title, options: item.options || [] }; // Ensure structure
            const isSubmitted = checkQuizSubmit.submitted;
            const submissionMessage = checkQuizSubmit.message;
            const isCorrect = checkQuizSubmit.isCorrect;

            return (
                <div className={`bg-gray-50 p-4 rounded-lg shadow-inner flex flex-col border border-gray-200`}>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">{quizContent?.questionText || item.title}</h3>
                     <div className={`${contentContainerClass} mb-4 flex-grow`}>
                        {/* Display description or additional info if available */}
                        {item.description && <p className="text-gray-600 mb-4">{item.description}</p>}

                        {/* Always show options if available, but disable if submitted */}
                        {quizContent?.options && quizContent.options.length > 0 ? (
                            <div className="space-y-2">
                                {quizContent.options.map((option, index) => (
                                    <label key={index} className={`flex items-center space-x-2 p-2 rounded border ${selectedAnswer === option ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} ${isSubmitted ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:bg-gray-100'}`}>
                                        <input
                                            type="radio"
                                            name={`quiz-answer-${item._id}`} // Unique name per quiz
                                            value={option}
                                            checked={selectedAnswer === option}
                                            onChange={handleAnswerChange}
                                            disabled={isSubmitted || showSubmitQuiz} // Disable if submitted OR if submit form is open but not yet sent
                                            className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                                        />
                                        <span className={`text-gray-700 ${isSubmitted ? 'text-gray-500' : ''}`}>{option}</span>
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 italic">No options available for this quiz.</p>
                        )}
                     </div>

                    {/* Submission Area */}
                     <div className="mt-auto pt-4 border-t border-gray-200">
                        {isSubmitted ? (
                            // Show submission status and result
                            <div className="flex items-center">
                                <FaCheckCircle className={`w-5 h-5 mr-2 ${isCorrect ? 'text-green-500' : 'text-yellow-500'}`} />
                                <p className={`text-sm font-semibold ${isCorrect ? 'text-green-700' : 'text-yellow-700'}`}>
                                     Quiz Submitted. {submissionMessage || (isCorrect ? 'Correct!' : 'Incorrect.')}
                                </p>
                            </div>
                        ) : showSubmitQuiz ? (
                            // Show Submit Form
                            <div>
                                <button
                                    onClick={handleQuizSubmit}
                                    disabled={!selectedAnswer || submitQuizMutation.isPending}
                                    className={`bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-200 ${
                                        (!selectedAnswer || submitQuizMutation.isPending) ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {submitQuizMutation.isPending ? 'Submitting...' : 'Submit Answer'}
                                </button>
                                <button
                                    onClick={() => { setShowSubmitQuiz(false); setSelectedAnswer(''); }} // Reset selection on cancel
                                    disabled={submitQuizMutation.isPending}
                                    className="ml-2 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded transition-colors duration-200 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                {submitQuizMutation.isError && (
                                    <p className="text-red-500 text-sm mt-2">Submission failed: {submitQuizMutation.error instanceof Error ? submitQuizMutation.error.message : 'Unknown error'}</p>
                                )}
                            </div>
                        ) : (
                             // Show 'Start Quiz' Button (conditionally enable based on options)
                             <button
                                 disabled={!quizContent?.options || quizContent.options.length === 0} // Disable if no options
                                 className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                 onClick={() => setShowSubmitQuiz(true)}
                             >
                                 Start Quiz
                             </button>
                         )}
                     </div>
                 </div>
            );
        }

        // --- Assignment Rendering ---
         if (item.type === 'assignment') {
             const isSubmitted = checkSubmit; // Use state variable

             return (
                 <div className={`bg-gray-50 p-4 rounded-lg shadow-inner flex flex-col border border-gray-200`}>
                     <h3 className="text-xl font-semibold text-gray-800 mb-3">Assignment: {item.title}</h3>
                     <div className={`${contentContainerClass} mb-4 flex-grow`}>
                        <p className="text-gray-700 whitespace-pre-wrap">{item.description || 'No description available.'}</p>
                     </div>

                     {/* Submission Area */}
                     <div className="mt-auto pt-4 border-t border-gray-200">
                         {isSubmitted ? (
                             // Show Submitted Status
                             <div className="flex items-center">
                                 <FaCheckCircle className="w-5 h-5 text-green-500 mr-2" />
                                 <p className="text-green-700 font-semibold">Assignment Submitted</p>
                                 {/* Optionally add link to view submission if available */}
                             </div>
                         ) : showSubmitAssignment ? (
                             // Show Submit Form
                             <div>
                                 <h4 className="text-md font-semibold mb-2">Upload Submission (PDF only)</h4>
                                 <input
                                     type="file"
                                     accept=".pdf,application/pdf" // Be specific with accept types
                                     onChange={handleFileChange}
                                     disabled={submitAssignmentMutation.isPending}
                                     className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-3 disabled:opacity-50"
                                 />
                                 {selectedFile && (
                                     <p className="text-sm text-gray-600 mb-3">Selected: {selectedFile.name}</p>
                                 )}
                                 <button
                                     onClick={handleAssignmentSubmit}
                                     disabled={!selectedFile || submitAssignmentMutation.isPending}
                                     className={`bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-200 ${
                                         (!selectedFile || submitAssignmentMutation.isPending) ? 'opacity-50 cursor-not-allowed' : ''
                                     }`}
                                 >
                                     {submitAssignmentMutation.isPending ? 'Uploading...' : 'Upload & Submit'}
                                 </button>
                                 <button
                                     onClick={() => { setShowSubmitAssignment(false); setSelectedFile(null); }}
                                     disabled={submitAssignmentMutation.isPending}
                                     className="ml-2 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded transition-colors duration-200 disabled:opacity-50"
                                 >
                                     Cancel
                                 </button>
                                 {submitAssignmentMutation.isError && (
                                     <p className="text-red-500 text-sm mt-2">Submission failed: {submitAssignmentMutation.error instanceof Error ? submitAssignmentMutation.error.message : 'Unknown error'}</p>
                                 )}
                                {/* No success message needed here as the UI transitions to "Submitted" state */}
                             </div>
                         ) : (
                             // Show 'Submit Assignment' Button
                             <button
                                 className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-200"
                                 onClick={() => setShowSubmitAssignment(true)}
                             >
                                 Submit Assignment
                             </button>
                         )}
                     </div>
                 </div>
             );
         }


        // --- Unit Rendering (Video, Image, Text) ---
        if (item.type === 'unit' && item.content) {
            // Normalize content value access
            const contentValue = typeof item.content === 'object' && item.content !== null && item.content.value
                ? item.content.value
                : typeof item.content === 'string'
                ? item.content
                : null;

            const commonMediaClasses = `max-w-full h-auto mb-4 rounded-lg shadow-md object-contain w-full ${contentContainerClass}`; // Applied to img/video
            const fallbackContainerClass = `bg-blue-50 border border-blue-200 p-4 rounded-lg shadow-md flex flex-col ${contentContainerClass}`;
            const fallbackTitleClass = "text-lg font-semibold text-blue-800 mb-2";
            const fallbackTextClass = "text-gray-700 flex-grow";

            if (contentValue) {
                // Image
                if (/\.(png|jpe?g|gif|webp|svg)$/i.test(contentValue)) { // Added SVG
                    return showTextFallback ? (
                        <div className={fallbackContainerClass}>
                            <h3 className={fallbackTitleClass}>Image Unavailable</h3>
                            <p className={fallbackTextClass}>The image ({contentValue.split('/').pop()}) could not be loaded. Check network or browser settings.</p>
                        </div>
                    ) : (
                        <img
                            src={contentValue}
                            alt={item.title || 'Course content image'} // Provide default alt
                            className={commonMediaClasses}
                            style={{ maxHeight: 'inherit' }} // Ensure it respects container height
                            loading="lazy" // Add lazy loading
                            onError={() => setShowTextFallback(true)}
                        />
                    );
                }
                // Video
                if (/\.(mp4|webm|ogv|ogg)$/i.test(contentValue)) { // Added ogv
                    return showTextFallback ? (
                        <div className={fallbackContainerClass}>
                            <h3 className={fallbackTitleClass}>Video Unavailable</h3>
                            <p className={fallbackTextClass}>The video ({contentValue.split('/').pop()}) could not be loaded. This might be due to network issues or browser restrictions (e.g., third-party cookies). Please ensure your browser allows videos from this source.</p>
                        </div>
                    ) : (
                        <video
                            key={contentValue} // Re-mount video player if src changes
                            src={contentValue}
                            controls
                            controlsList="nodownload" // Optional: disable download button
                            className={commonMediaClasses}
                            style={{ maxHeight: 'inherit' }}
                             onError={(e) => {
                                 console.error("Video Error:", e.target.error);
                                 setShowTextFallback(true);
                             }}
                             // preload="metadata" // Optional: load only metadata initially
                        />
                    );
                }
                 // Text Content (including potential URLs that aren't images/videos)
                 // Render simple text content directly
                return <div className={`text-gray-800 whitespace-pre-wrap ${contentContainerClass} prose prose-sm max-w-none`} dangerouslySetInnerHTML={{ __html: contentValue }}></div>; // Using prose for basic formatting, consider sanitizing if HTML is complex/user-generated
            }
        }

        // Fallback for units without content or unknown types
        return <p className={`text-gray-600 italic ${contentContainerClass}`}>Content for '{item.title}' is not available or is in an unsupported format.</p>;
    };

    // Update local progress when modules data changes (e.g., after fetch or mutation)
    useEffect(() => {
        if (data?.modules) {
            setLocalProgress(calculateCourseProgress(data.modules));
        }
    }, [data?.modules]); // Depend only on the data itself


    // --- JSX Return ---
    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col md:flex-row w-full">
            {/* Left Content Area (Main View & Course Overview) */}
            <div className="flex-1 p-4 md:p-6 overflow-y-auto w-full md:max-h-screen flex flex-col space-y-4 md:space-y-6"> {/* Added spacing */}

                {/* Top Section: Selected Item Viewer */}
                <div className="bg-white shadow-lg rounded-lg p-4 md:p-6 flex-grow flex flex-col min-h-[45vh]"> {/* Adjusted min-height */}
                    {isLoading && !selectedItem && ( /* Show loading only if nothing selected yet */
                        <div className="text-center text-gray-500 p-10 flex-grow flex items-center justify-center">
                            <p>Loading course content...</p> {/* Simple loading */}
                        </div>
                    )}
                     {isError && ( /* Show error if fetching failed */
                         <div className="text-center text-red-500 p-10 flex-grow flex flex-col items-center justify-center">
                             <p className="font-semibold">Failed to load course content.</p>
                             <p className="text-sm mt-2">({error instanceof Error ? error.message : 'Please try again later.'})</p>
                         </div>
                     )}
                     {/* Render selected item or default message */}
                    {!isLoading && !isError && (selectedItem ? (
                         <div className="flex flex-col h-full">
                             {/* Title stays fixed */}
                             <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">{selectedItem.title}</h2>
                             {/* Content area scrolls */}
                             <div className="flex-grow overflow-y-auto pr-2 -mr-2"> {/* Added padding for scrollbar */}
                                 {renderContent(selectedItem)}
                             </div>
                         </div>
                     ) : (
                         <div className="text-center text-gray-500 p-10 flex-grow flex flex-col items-center justify-center">
                             <h2 className="text-xl mb-2">Welcome!</h2>
                             <p>Select an item from the course content list on the right to begin.</p>
                             {modules.length === 0 && !isLoading && <p className="mt-2 text-sm text-yellow-600">No modules found in this course.</p>}
                         </div>
                     ))}
                </div>

                 {/* Bottom Section: Course Overview */}
                <div className="bg-white shadow-lg rounded-lg p-4 md:p-6 flex-grow flex flex-col mt-4 md:mt-0"> {/* Removed mt-4 for small screens, rely on space-y */}
                     {/* Loading/Error state for course details specifically? */}
                     {isLoading && !course && <p className="text-gray-500">Loading course details...</p>}
                     {isError && !course && <p className="text-red-500">Could not load course details.</p>}

                     {course && (
                        <>
                            <div className="mb-6 border-b pb-4">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
                                {/* Details row */}
                                <div className="flex flex-wrap items-center text-gray-600 space-x-4 text-sm mb-4">
                                    {course.instructorId?.username && <span>Instructor: <strong>{course.instructorId.username}</strong></span>}
                                    {course.rating && course.rating > 0 && (
                                        <div className="flex items-center">
                                            <span className="text-yellow-500 mr-1">{'★'.repeat(Math.floor(course.rating))}{'☆'.repeat(5 - Math.floor(course.rating))}</span>
                                            <span>({course.reviews?.length || 0} ratings)</span> {/* Assuming reviews is an array */}
                                        </div>
                                    )}
                                    {course.totalDuration && <span>{course.totalDuration}</span>}
                                </div>
                                {/* Progress Bar */}
                                <div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                        <div className="bg-blue-600 h-2.5 rounded-full transition-width duration-300 ease-in-out" style={{ width: `${localProgress}%` }}></div>
                                    </div>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-sm font-medium text-gray-600">{localProgress}% completed</span>
                                    </div>
                                </div>
                            </div>

                            {/* Description and other sections */}
                             <div className="space-y-6 overflow-y-auto pr-2 -mr-2"> {/* Added scroll for potentially long descriptions */}
                                 <div>
                                     <h2 className="text-xl font-semibold text-gray-800 mb-3">Description</h2>
                                     <p className="text-gray-600 leading-relaxed whitespace-pre-wrap prose prose-sm max-w-none">{course.description || 'No description provided.'}</p>
                                 </div>

                                 {/* Extracted List Section Component (Example) */}
                                 <ListSection title="What You'll Learn" items={course.whatYoullLearn} />
                                 <ListSection title="Highlights" items={course.highlights} />
                                 <ListSection title="Learning Objectives" items={course.objectives} />
                                 {/* Add other sections similarly */}
                             </div>
                         </>
                     )}
                     {!course && !isLoading && !isError && <p className="text-gray-500">Course details not available.</p>}
                 </div>
            </div>

            {/* Right Sidebar (Course Content List) */}
            <div className="w-full md:w-80 lg:w-96 p-4 bg-white shadow-lg md:sticky md:top-0 md:h-screen overflow-y-auto border-l border-gray-200 flex-shrink-0">
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-1">Course Content</h2>
                     <div className="text-sm text-gray-600 mb-2">
                         {course?.totalDuration ? `${course.totalDuration} | ` : ''}
                         {modules.reduce((acc, mod) => acc + (mod.units?.length || 0) + (mod.assignments?.length || 0) + (mod.quizzes?.length || 0), 0)} lessons
                     </div>
                     {/* Progress Bar in Sidebar */}
                     <div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-blue-600 h-1.5 rounded-full transition-width duration-300 ease-in-out" style={{ width: `${localProgress}%` }}></div>
                        </div>
                        <span className="text-xs text-gray-500 block text-right">{localProgress}% completed</span> {/* Moved text */}
                    </div>
                </div>

                {/* Module List */}
                {isLoading && <p className="text-sm text-gray-500">Loading modules...</p>}
                {isError && <p className="text-sm text-red-500">Error loading modules.</p>}
                {!isLoading && !isError && modules?.length === 0 && <p className="text-sm text-gray-500">No content modules found for this course.</p>}

                 {!isLoading && !isError && modules?.map((module) => (
                    <div key={module._id} className="mb-2 rounded-md overflow-hidden border border-gray-200 last:mb-0">
                        {/* Module Header */}
                        <div
                            className="flex justify-between items-center cursor-pointer p-3 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                            onClick={() => toggleModule(module._id)}
                             role="button"
                             aria-expanded={expandedModule === module._id}
                             aria-controls={`module-content-${module._id}`}
                         >
                            <h3 className="font-medium text-sm text-gray-800 flex-1 mr-2 line-clamp-2">{module.title}</h3> {/* Allow wrapping */}
                            {expandedModule === module._id ? <FaChevronUp className="w-3 h-3 text-gray-500 flex-shrink-0" /> : <FaChevronDown className="w-3 h-3 text-gray-500 flex-shrink-0" />}
                        </div>

                        {/* Module Content (Units, Assignments, Quizzes) */}
                        {expandedModule === module._id && (
                             <ul id={`module-content-${module._id}`} className="bg-white border-t border-gray-200 py-1 transition-all duration-300">
                                 {!module.units?.length && !module.assignments?.length && !module.quizzes?.length && (
                                     <li className="px-4 py-2 text-xs text-gray-400 italic">No items in this module.</li>
                                 )}
                                 {/* Render Units */}
                                 {module.units?.map((unit) => (
                                     <SidebarItem
                                         key={unit._id}
                                         item={{ ...unit, type: 'unit' }}
                                         selectedItemId={selectedItem?._id}
                                         onItemClick={handleItemClick}
                                         onCheckboxChange={handleCheckboxChange}
                                         Icon={FaPlay}
                                         isCompleting={markCompleteMutation.isPending && markCompleteMutation.variables?.itemId === unit._id}
                                     />
                                 ))}
                                 {/* Render Assignments */}
                                 {module.assignments?.map((assignment) => (
                                     <SidebarItem
                                         key={assignment._id}
                                         item={{ ...assignment, type: 'assignment' }}
                                         selectedItemId={selectedItem?._id}
                                         onItemClick={handleItemClick}
                                         onCheckboxChange={handleCheckboxChange}
                                         Icon={FaFileAlt}
                                          isCompleting={markCompleteMutation.isPending && markCompleteMutation.variables?.itemId === assignment._id}
                                         // Disable checkbox interaction until submitted? Optional based on requirements
                                         // checkboxDisabled={!assignment.submitted} // Need 'submitted' flag from backend data
                                     />
                                 ))}
                                 {/* Render Quizzes */}
                                 {module.quizzes?.map((quiz) => (
                                     <SidebarItem
                                         key={quiz._id}
                                         item={{ ...quiz, type: 'quiz' }}
                                         selectedItemId={selectedItem?._id}
                                         onItemClick={handleItemClick}
                                         onCheckboxChange={handleCheckboxChange}
                                         Icon={FaQuestionCircle}
                                         isCompleting={markCompleteMutation.isPending && markCompleteMutation.variables?.itemId === quiz._id}
                                         // Disable checkbox until submitted AND correct? Optional
                                         // checkboxDisabled={!quiz.submitted || !quiz.isCorrect} // Need these flags
                                     />
                                 ))}
                            </ul>
                         )}
                     </div>
                 ))}
            </div>
        </div>
    );
};

// Helper component for list sections in Course Overview
const ListSection = ({ title, items }) => {
    if (!items || items.length === 0) return null;
    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600 pl-4">
                {items.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    );
};


// Helper component for items in the Sidebar
const SidebarItem = ({ item, selectedItemId, onItemClick, onCheckboxChange, Icon, isCompleting, checkboxDisabled = false }) => {
    const isSelected = selectedItemId === item._id;
    const effectiveCheckboxDisabled = checkboxDisabled || isCompleting; // Disable if passed prop or if mutation is pending for this item

    return (
        <li
            className={`flex items-center cursor-pointer hover:bg-gray-100 transition-colors duration-150 group ${
                isSelected ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
            }`}
            onClick={() => onItemClick(item)} // Pass the full item object with type
        >
            {/* Checkbox / Completion Status */}
            <div className="p-2 pl-3 pr-2 flex-shrink-0">
                <input
                    type="checkbox"
                    checked={item.completed || false}
                    onChange={(e) => {
                         e.stopPropagation(); // Prevent li onClick from firing
                         if (!effectiveCheckboxDisabled) {
                            onCheckboxChange(item); // Pass the full item object with type
                         }
                    }}
                    disabled={effectiveCheckboxDisabled}
                    className={`form-checkbox h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                         item.completed ? 'checked:bg-blue-600' : ''
                     } ${isCompleting ? 'animate-pulse' : ''}`} // Pulse effect while updating
                    aria-label={`Mark ${item.title} as ${item.completed ? 'incomplete' : 'complete'}`}
                 />
             </div>
            {/* Icon and Title */}
            <div className="flex-grow flex items-center py-2 pr-2 overflow-hidden"> {/* Ensure title doesn't overflow */}
                <Icon className={`w-3.5 h-3.5 mr-2 flex-shrink-0 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className="flex-1 text-sm truncate" title={item.title}>
                    {item.title}
                </span>
            </div>
        </li>
    );
};


export default CourseContentPage;