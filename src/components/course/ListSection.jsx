import React from 'react';
import PropTypes from 'prop-types';

const ListSection = ({
  title,
  items = [],
  fallbackMessage = 'No data available.',
  badgeColor = 'bg-gray-100 text-gray-800',
}) => {
  return (
    <section>
      <h3 className="text-xl font-semibold text-gray-800 mb-4" aria-live="polite">
        {title}
      </h3>
      {items.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <li
              key={index}
              className={`px-3 py-1 rounded-full text-sm font-medium ${badgeColor}`}
              aria-label={`Item: ${item}`}
            >
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm">{fallbackMessage}</p>
      )}
    </section>
  );
};

ListSection.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.string),
  fallbackMessage: PropTypes.string,
  badgeColor: PropTypes.string,
};

export default ListSection;
