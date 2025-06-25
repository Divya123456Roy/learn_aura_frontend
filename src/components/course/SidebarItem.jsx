import React from 'react';

const SidebarItem = ({ item, selectedItemId, onItemClick, onCheckboxChange, Icon, isCompleting, checkboxDisabled = true }) => {
    const isSelected = selectedItemId === item._id;
    const effectiveCheckboxDisabled = checkboxDisabled || isCompleting;

    return (
        <li
            className={`flex items-center cursor-pointer hover:bg-gray-100 transition-colors duration-150 group ${isSelected ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'}`}
            onClick={() => onItemClick(item)}
        >
            <div className="p-2 pl-3 pr-2 flex-shrink-0">
                {item.type !== "unit" && 
                <input
                type="checkbox"
                checked={item.isSubmitted || false}
                onChange={(e) => {
                    e.stopPropagation();
                    if (!effectiveCheckboxDisabled) {
                        if (e.target.checked) {
                            // Run your function here when the checkbox is checked
                            onCheckboxChange(item);
                        }
                    }
                }}
                disabled={effectiveCheckboxDisabled}
                className={`form-checkbox h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${item.completed ? 'checked:bg-blue-600' : ''} ${isCompleting ? 'animate-pulse' : ''}`}
                aria-label={`Mark ${item.title} as ${item.completed ? 'incomplete' : 'complete'}`}
            />}
                
            </div>
            <div className="flex-grow flex items-center py-2 pr-2 overflow-hidden">
                <Icon className={`w-3.5 h-3.5 mr-2 flex-shrink-0 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className="flex-1 text-sm truncate" title={item.title}>
                    {item.title}
                </span>
            </div>
        </li>
    );
};

export default SidebarItem;