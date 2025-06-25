import React from 'react';
import { FaChevronUp, FaChevronDown, FaPlay, FaFileAlt, FaQuestionCircle } from 'react-icons/fa';
import SidebarItem from './SidebarItem';

const ModuleItem = ({
    module,
    expandedModule,
    toggleModule,
    selectedItem,
    handleItemClick,
    handleCheckboxChange,
    markCompleteMutation,
}) => {

    

    return (
        <div className="mb-2 rounded-md overflow-hidden border border-gray-200 last:mb-0">
            <div
                className="flex justify-between items-center cursor-pointer p-3 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                onClick={() => toggleModule(module._id)}
                role="button"
                aria-expanded={expandedModule === module._id}
                aria-controls={`module-content-${module._id}`}
            >
                <h3 className="font-medium text-sm text-gray-800 flex-1 mr-2 line-clamp-2">{module.title}</h3>
                {expandedModule === module._id ? <FaChevronUp className="w-3 h-3 text-gray-500 flex-shrink-0" /> : <FaChevronDown className="w-3 h-3 text-gray-500 flex-shrink-0" />}
            </div>
            {expandedModule === module._id && (
                <ul id={`module-content-${module._id}`} className="bg-white border-t border-gray-200 py-1 transition-all duration-300">
                    {!module.units?.length && !module.assignments?.length && !module.quizzes?.length && (
                        <li className="px-4 py-2 text-xs text-gray-400 italic">No items in this module.</li>
                    )}
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
                    {module.assignments?.map((assignment) => (
                        <SidebarItem
                            key={assignment._id}
                            item={{ ...assignment, type: 'assignment' }}
                            selectedItemId={selectedItem?._id}
                            onItemClick={handleItemClick}
                            onCheckboxChange={handleCheckboxChange}
                            Icon={FaFileAlt}
                            isCompleting={markCompleteMutation.isPending && markCompleteMutation.variables?.itemId === assignment._id}
                        />
                    ))}
                    {module.quizzes?.map((quiz) => (
                        <SidebarItem
                            key={quiz._id}
                            item={{ ...quiz, type: 'quiz' }}
                            selectedItemId={selectedItem?._id}
                            onItemClick={handleItemClick}
                            onCheckboxChange={handleCheckboxChange}
                            Icon={FaQuestionCircle}
                            isCompleting={markCompleteMutation.isPending && markCompleteMutation.variables?.itemId === quiz._id}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ModuleItem;