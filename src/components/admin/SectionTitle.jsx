import PropTypes from 'prop-types';

/**
 * Professional Section Title Component
 * Displays a consistent title with optional subtitle and actions
 */
export default function SectionTitle({ 
  title, 
  subtitle, 
  actions, 
  className = "",
  size = "large" 
}) {
  const sizeClasses = {
    small: "text-lg",
    medium: "text-xl",
    large: "text-2xl",
    xlarge: "text-3xl"
  };

  return (
    <div className={`flex justify-between items-center py-6 ${className}`}>
      <div>
        <h1 className={`font-bold text-gray-900 ${sizeClasses[size]} mb-2`}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-gray-600 text-sm">
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}

SectionTitle.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  actions: PropTypes.node,
  className: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
};