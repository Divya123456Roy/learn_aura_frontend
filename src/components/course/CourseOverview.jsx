import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCourseContentAPI } from '../../services/courseAPI';
import ListSection from './ListSection';
import { useNavigate } from 'react-router-dom';

const CourseOverview = ({ courseId }) => {
  const [localProgress, setLocalProgress] = useState(0);
  const navigate = useNavigate()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['fetch-course', courseId],
    queryFn: () => getCourseContentAPI(courseId),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  const course = data?.course;
  const modules = data?.modules || [];

  const calculateCourseProgress = (currentModules) => {
    if (!currentModules || currentModules.length === 0) return 0;

    let completedItems = 0;
    let totalItems = 0;

    currentModules.forEach((module) => {
      totalItems += module.assignments?.length || 0;
      completedItems += module.assignments?.filter((a) => a.isSubmitted).length || 0;

      totalItems += module.quizzes?.length || 0;
      completedItems += module.quizzes?.filter((q) => q.isSubmitted).length || 0;
    });

    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  };

  useEffect(() => {
    if (modules.length > 0) {
      setLocalProgress(calculateCourseProgress(modules));
    }
  }, [modules]);

  useEffect(() => {
    if (course) {
      console.log('Fetched Course Details:', course);
    }
  }, [course]);

  useEffect(() => {
    if (course) {
      console.log('What You will Learn:', course.whatYoullLearn);
      console.log('Description:', course.description);
      console.log('Highlights:', course.highlights);
    }
  }, [course]);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 flex justify-center items-start py-8 px-4">
      <div className="w-full max-w-7xl">
        {isLoading && !course && (
          <p className="text-gray-500 text-center text-lg">Loading course details...</p>
        )}
        {isError && !course && (
          <p className="text-red-500 text-center text-lg">
            Could not load course details: {error?.message || 'Unknown error'}
          </p>
        )}
        {course && (
          <div className="bg-white shadow-2xl rounded-3xl p-6 md:p-10 min-h-[70vh] flex flex-col">
            {/* Header Section */}
            <div className="mb-8 border-b pb-6">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                {course.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-gray-600 text-base md:text-lg">
                {course.instructorId?.username && (
                  <span className="flex items-center">
                    <svg className="w-6 h-6 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>
                      Instructor: <strong>{course.instructorId.username}</strong>
                    </span>
                  </span>
                )}
                {course.rating && course.rating > 0 && (
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-2">
                      {'★'.repeat(Math.floor(course.rating))}{'☆'.repeat(5 - Math.floor(course.rating))}
                    </span>
                    <span>({course.reviews?.length || 0} ratings)</span>
                  </div>
                )}
                {course.totalDuration && (
                  <span className="flex items-center">
                    <svg className="w-6 h-6 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{course.totalDuration}</span>
                  </span>
                )}
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-700 h-4 rounded-full transition-all duration-300 ease-in-out"
                    style={{ width: `${localProgress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-base font-medium text-gray-700">
                    {localProgress}% completed
                  </span>
                </div>
              </div>
            </div>

            {/* Content Sections */}
            <div className="flex-grow overflow-y-auto space-y-10 pr-2">
              {/* Description */}
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">Description</h2>
                <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                  {course.description || 'No description provided.'}
                </p>
              </div>

              {/* What You'll Learn and Highlights */}
              <div className="grid md:grid-cols-2 gap-8">
                <ListSection
                  title="What You'll Learn"
                  items={course.whatYoullLearn || []}
                  fallbackMessage="No learning outcomes provided."
                  badgeColor="bg-blue-100 text-blue-800"
                />
                <ListSection
                  title="Highlights"
                  items={course.highlights || []}
                  fallbackMessage="No highlights provided."
                  badgeColor="bg-green-100 text-green-800"
                />
              </div>

              {/* Certificate Section */}
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">Certificate</h2>
                {localProgress === 100 ? (
                  <div className="mt-6">
                    <button 
                      onClick={() => navigate(`/student/certificate/${courseId}`)}
                      className="relative inline-flex items-center justify-center px-8 py-4 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out rounded-full shadow-lg group hover:ring-2 hover:ring-indigo-500"
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700"></span>
                      <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-indigo-500 rounded-full opacity-30 group-hover:rotate-90 ease"></span>
                      <span className="relative flex items-center text-white text-lg font-semibold">
                        <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Download Completion Certificate
                      </span>
                    </button>
                    <p className="mt-3 text-gray-500 text-sm">
                      Congratulations! You've completed all requirements for this course.
                    </p>
                  </div>
                ) : (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-blue-800">
                          Upon completing {100 - localProgress}% more of this course, you'll receive a verifiable certificate of completion that you can share with your professional network.
                        </p>
                        <p className="text-blue-600 text-sm mt-2">
                          Certificate requirements: Complete all assignments and quizzes.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {!course && !isLoading && !isError && (
          <p className="text-gray-500 text-center text-lg">Course details not available.</p>
        )}
      </div>
    </div>
  );
};

export default CourseOverview;