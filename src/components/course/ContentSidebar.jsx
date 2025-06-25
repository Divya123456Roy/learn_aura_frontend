import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCourseContentAPI, markItemAsCompleteAPI } from '../../services/courseAPI';
import ModuleItem from './ModuleItem';

const ContentSidebar = ({ courseId,selectedItem,setSelectedItem }) => {
    const [expandedModule, setExpandedModule] = useState(null);
    const [localProgress, setLocalProgress] = useState(0);

    const queryClient = useQueryClient();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['fetch-course', courseId],
        queryFn: () => getCourseContentAPI(courseId),
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
        onSuccess: (data) => {
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
    });
    console.log(data);
    
    const course = data?.course;
    const modules = data?.modules || [];

    const calculateCourseProgress = (currentModules) => {
        if (!currentModules || currentModules.length === 0) return 0;
    
        let completedItems = 0;
        let totalItems = 0;
    
        currentModules.forEach((module) => {
            // Count assignments
            totalItems += module.assignments?.length || 0;
            completedItems += module.assignments?.filter((assignment) => assignment.isSubmitted).length || 0;
    
            // Count quizzes
            totalItems += module.quizzes?.length || 0;
            completedItems += module.quizzes?.filter((quiz) => quiz.isSubmitted).length || 0;
    
            // Optional: Include units if they have an isSubmitted field
            // totalItems += module.units?.length || 0;
            // completedItems += module.units?.filter((unit) => unit.isSubmitted).length || 0;
        });
    
        return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    };
    
    useEffect(() => {
        if (modules) {
            setLocalProgress(calculateCourseProgress(modules));
        }
    }, [modules]);

    const markCompleteMutation = useMutation({
        mutationFn: markItemAsCompleteAPI,
        onSuccess: () => {
            queryClient.invalidateQueries(['fetch-course', courseId]);
        },
        onError: (err, variables) => {
            console.error("Error marking item complete:", err);
            alert(`Failed to update completion status for ${variables.type}.`);
            if (context?.previousData) {
                queryClient.setQueryData(['fetch-course', courseId], context.previousData);
                setLocalProgress(calculateCourseProgress(context.previousData.modules));
            }
        },
        onMutate: async (variables) => {
            const { itemId, type, completed } = variables;
            await queryClient.cancelQueries(['fetch-course', courseId]);
            const previousData = queryClient.getQueryData(['fetch-course', courseId]);

            if (previousData) {
                const updatedModules = previousData.modules.map(module => ({
                    ...module,
                    units: module.units?.map(item => item._id === itemId ? { ...item, completed } : item),
                    assignments: module.assignments?.map(item => item._id === itemId ? { ...item, completed } : item),
                    quizzes: module.quizzes?.map(item => item._id === itemId ? { ...item, completed } : item),
                }));

                queryClient.setQueryData(['fetch-course', courseId], { ...previousData, modules: updatedModules });
                setLocalProgress(calculateCourseProgress(updatedModules));
            }
            return { previousData };
        },
    });

    const toggleModule = (moduleId) => {
        setExpandedModule(expandedModule === moduleId ? null : moduleId);
    };

    const handleItemClick = (item) => {
        if (!item) return;
        setSelectedItem(item);
    };

    const handleCheckboxChange = (item) => {
        if (!item || !item._id || !item.type) {
            console.error("Invalid item:", item);
            return;
        }
        const newCompletedStatus = !item.completed;
        markCompleteMutation.mutate({
            courseId,
            itemId: item._id,
            type: item.type,
            completed: newCompletedStatus
        });
    };

    return (
        <div className="w-full md:w-80 lg:w-96 p-4 bg-white shadow-lg md:sticky md:top-0 md:h-screen overflow-y-auto border-l border-gray-200 flex-shrink-0">
            <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-1">Course Content</h2>
                <div className="text-sm text-gray-600 mb-2">
                    {course?.totalDuration ? `${course.totalDuration} | ` : ''}
                    {modules.reduce((acc, mod) => acc + (mod.units?.length || 0) + (mod.assignments?.length || 0) + (mod.quizzes?.length || 0), 0)} lessons
                </div>
                <div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-blue-600 h-1.5 rounded-full transition-width duration-300 ease-in-out" style={{ width: `${localProgress}%` }}></div>
                    </div>
                    <span className="text-xs text-gray-500 block text-right">{localProgress}% completed</span>
                </div>
            </div>
            {isLoading && <p className="text-sm text-gray-500">Loading modules...</p>}
            {isError && <p className="text-sm text-red-500">Error loading modules: {error?.message}</p>}
            {!isLoading && !isError && modules?.length === 0 && <p className="text-sm text-gray-500">No content modules found.</p>}
            {!isLoading && !isError && modules?.map((module) => (
                <ModuleItem
                    key={module._id}
                    module={module}
                    expandedModule={expandedModule}
                    toggleModule={toggleModule}
                    selectedItem={selectedItem}
                    handleItemClick={handleItemClick}
                    handleCheckboxChange={handleCheckboxChange}
                    markCompleteMutation={markCompleteMutation}
                />
            ))}
        </div>
    );
};

export default ContentSidebar;