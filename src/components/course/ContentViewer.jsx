import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { checkAssignmentSubmittedAPI, checkQuizSubmittedAPI } from '../../services/assignmentAPI';
import { submitAssignmentAPI, submitQuizAPI } from '../../services/courseAPI';
import { getQuizSubmissionByIdAPI } from '../../services/quizAPI';

const ContentViewer = ({ courseId, selectedItem, checkSubmit, setCheckSubmit, checkQuizSubmit, setCheckQuizSubmit }) => {
    const [showTextFallback, setShowTextFallback] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState('');

    const queryClient = useQueryClient();

    const { data: assignmentStatus, isLoading: isAssignmentStatusLoading } = useQuery({
        queryKey: ['check-assignment', selectedItem?._id],
        queryFn: () => checkAssignmentSubmittedAPI({ assignmentId: selectedItem._id }),
        enabled: !!selectedItem?._id && selectedItem?.type === 'assignment',
        onSuccess: (data) => setCheckSubmit(data?.response === true),
        onError: () => setCheckSubmit(false),
    });

    const { data: quizStatus, isLoading: isQuizStatusLoading } = useQuery({
        queryKey: ['check-quiz', selectedItem?._id],
        queryFn: () => getQuizSubmissionByIdAPI({ quizId: selectedItem._id }),
        enabled: !!selectedItem?._id && selectedItem?.type === 'quiz',
        onError: () => setCheckQuizSubmit({ submitted: false, isCorrect: null, selectedAnswer: null }),
    });

    useEffect(() => {
        if (quizStatus) {
            setCheckQuizSubmit({
                submitted: quizStatus?.response === true,
                isCorrect: quizStatus?.isCorrect,
                correctAnswer: quizStatus?.correctAnswer,
                selectedAnswer: quizStatus?.selectedAnswer
            });
        }
    }, [selectedItem, quizStatus]);

    const submitAssignmentMutation = useMutation({
        mutationFn: submitAssignmentAPI,
        onSuccess: () => {
            queryClient.invalidateQueries(['check-assignment', selectedItem._id]);
            queryClient.invalidateQueries(['fetch-course', courseId]);
            setSelectedFile(null);
            setCheckSubmit(true);
        },
        onError: (err) => {
            const message = err.response?.data?.message || err.message || "Failed to submit assignment.";
            alert(message);
        },
    });

    const submitQuizMutation = useMutation({
        mutationFn: submitQuizAPI,
        onSuccess: (data) => {
            queryClient.invalidateQueries(['check-quiz', selectedItem._id]);
            queryClient.invalidateQueries(['fetch-course', courseId]);
            setSelectedAnswer('');
            setCheckQuizSubmit({
                submitted: true,
                isCorrect: data?.isCorrect,
                selectedAnswer: data?.submission?.selectedAnswer
            });
        },
        onError: (err) => {
            const message = err.response?.data?.message || err.message || "Failed to submit quiz.";
            alert(message);
        },
    });

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

    const contentContainerClass = 'min-h-[40vh] max-h-[60vh] overflow-auto p-2';

    const renderContent = (item) => {
        if (!item) return <p className="text-gray-500 p-4">Select an item from the course content list to view its details.</p>;

        if (item.type === 'quiz') {
            const quizContent = item.content || { questionText: item.title, options: item.options || [] };
            const isCorrect = checkQuizSubmit.isCorrect;

            return (
                <div className="bg-gray-50 p-4 rounded-lg shadow-inner flex flex-col border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">{quizContent?.questionText || item.title}</h3>
                    <div className={`${contentContainerClass} mb-4 flex-grow`}>
                        {checkQuizSubmit.submitted ? (
                            <div className="flex items-center space-x-2">
                                {isCorrect ? (
                                    <FaCheckCircle className="w-5 h-5 text-green-500" />
                                ) : (
                                    <FaTimesCircle className="w-5 h-5 text-red-500" />
                                )}
                                <p className={`text-sm font-semibold ${checkQuizSubmit?.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                                    Quiz Answered
                                    {!checkQuizSubmit?.isCorrect && checkQuizSubmit?.correctAnswer && ` (Correct Answer: ${checkQuizSubmit?.correctAnswer})`}
                                </p>
                            </div>
                        ) : quizContent?.options?.length > 0 ? (
                            <div className="space-y-2">
                                {quizContent.options.map((option, index) => (
                                    <label key={index} className={`flex items-center space-x-2 p-2 rounded border ${selectedAnswer === option ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} cursor-pointer hover:bg-gray-100`}>
                                        <input
                                            type="radio"
                                            name={`quiz-answer-${item._id}`}
                                            value={option}
                                            checked={selectedAnswer === option}
                                            onChange={handleAnswerChange}
                                            disabled={checkQuizSubmit.submitted}
                                            className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                                        />
                                        <span className="text-gray-700">{option}</span>
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 italic">No options available for this quiz.</p>
                        )}
                    </div>
                    <div className="mt-auto pt-4 border-t border-gray-200">
                        {!checkQuizSubmit.submitted && (
                            <button
                                onClick={handleQuizSubmit}
                                disabled={!selectedAnswer || submitQuizMutation.isPending}
                                className={`bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-200 ${(!selectedAnswer || submitQuizMutation.isPending) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {submitQuizMutation.isPending ? 'Submitting...' : 'Submit Quiz'}
                            </button>
                        )}
                    </div>
                </div>
            );
        }

        if (item.type === 'assignment') {
            return (
                <div className="bg-gray-50 p-4 rounded-lg shadow-inner flex flex-col border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Assignment: {item.title}</h3>
                    <div className={`${contentContainerClass} mb-4 flex-grow`}>
                        {/* {console.log(item.description)} */}
                        <p className="text-gray-700 whitespace-pre-wrap">{item.content || 'No description available.'}</p>
                        <a href={assignmentStatus?.assignment} type="application/pdf" target="_blank" rel="noopener noreferrer">Open File</a>
                    </div>
                    <div className="mt-auto pt-4 border-t border-gray-200">
                        {assignmentStatus?.response ? (
                            <div className="flex items-center">
                                <FaCheckCircle className="w-5 h-5 text-green-500 mr-2" />
                                <p className="text-green-700 font-semibold">Assignment Submitted {assignmentStatus?.grade ? `with grade ${assignmentStatus.grade}` : `(Not graded yet)`}</p>
                            </div>
                        ) : (
                            <div>
                                <h4 className="text-md font-semibold mb-2">Upload Submission (PDF only)</h4>
                                <input
                                    type="file"
                                    accept=".pdf,application/pdf"
                                    onChange={handleFileChange}
                                    disabled={submitAssignmentMutation.isPending}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-3 disabled:opacity-50"
                                />
                                {selectedFile && (
                                    <p className="text-sm text-gray-600 mb-3">Selected: {selectedFile.name}</p>
                                )}
                                <button
                                    onClick={handleAssignmentSubmit}
                                    disabled={!selectedFile || submitAssignmentMutation.isPending || checkSubmit}
                                    className={`bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-200 ${(!selectedFile || submitAssignmentMutation.isPending || checkSubmit) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {submitAssignmentMutation.isPending ? 'Uploading...' : 'Submit Assignment'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        if (item.type === 'unit' && item.content) {
            const contentValue = typeof item.content === 'object' && item.content !== null && item.content.value
                ? item.content.value
                : typeof item.content === 'string'
                    ? item.content
                    : null;

            const commonMediaClasses = `max-w-full h-auto mb-4 rounded-lg shadow-md object-contain w-full ${contentContainerClass}`;
            const fallbackContainerClass = `bg-blue-50 border border-blue-200 p-4 rounded-lg shadow-md flex flex-col ${contentContainerClass}`;
            const fallbackTitleClass = "text-lg font-semibold text-blue-800 mb-2";
            const fallbackTextClass = "text-gray-700 flex-grow";

            if (contentValue) {
                if (/\.(png|jpe?g|gif|webp|svg)$/i.test(contentValue)) {
                    return showTextFallback ? (
                        <div className={fallbackContainerClass}>
                            <h3 className={fallbackTitleClass}>Image Unavailable</h3>
                            <p className={fallbackTextClass}>The image could not be loaded.</p>
                        </div>
                    ) : (
                        <img
                            src={contentValue}
                            alt={item.title || 'Course content image'}
                            className={commonMediaClasses}
                            style={{ maxHeight: '100%', height: 'auto' }}
                            loading="lazy"
                            onError={() => setShowTextFallback(true)}
                        />
                    );
                }
                if (/\.(mp4|webm|ogv|ogg)$/i.test(contentValue)) {
                    return showTextFallback ? (
                        <div className={fallbackContainerClass}>
                            <h3 className={fallbackTitleClass}>Video Unavailable</h3>
                            <p className={fallbackTextClass}>The video could not be loaded.</p>
                        </div>
                    ) : (
                        <video
                            key={contentValue}
                            src={contentValue}
                            controls
                            controlsList="nodownload"
                            className={commonMediaClasses}
                            style={{ maxHeight: '100%', height: 'auto' }}
                            onError={() => setShowTextFallback(true)}
                        />
                    );
                }
                return <div className={`text-gray-800 whitespace-pre-wrap ${contentContainerClass} prose prose-sm max-w-none`} dangerouslySetInnerHTML={{ __html: contentValue }}></div>;
            }
        }

        return <p className={`text-gray-600 italic ${contentContainerClass}`}>Content for '{item.title}' is not available or is in an unsupported format.</p>;
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-4 md:p-6 flex-grow flex flex-col h-[80vh]">
            {(isAssignmentStatusLoading || isQuizStatusLoading) && !selectedItem && (
                <div className="text-center text-gray-500 p-10 flex-grow flex items-center justify-center">
                    <p>Loading content...</p>
                </div>
            )}
            {selectedItem ? (
                <div className="flex flex-col h-full">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">{selectedItem.title}</h2>
                    <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                        {renderContent(selectedItem)}
                    </div>
                </div>
            ) : (
                <div className="text-center text-gray-500 p-10 flex-grow flex flex-col items-center justify-center">
                    <h2 className="text-xl mb-2">Welcome!</h2>
                    <p>Select an item from the course content list to begin.</p>
                </div>
            )}
        </div>
    );
};

export default ContentViewer;
