

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from 'prop-types';
import ProfilePicture from "./ImageUpload/ProfilePicture";

/**
 * Professional Navigation Item Component
 * Supports icons, avatars, active states, and disabled states
 */
export default function NavItem({ 
  title, 
  icon, 
  active = false, 
  onClick, 
  avatar, 
  disabled = false, 
  className = "" 
}) {
  return (
    <div 
      className={`w-full flex transition-all duration-200 ${
        active 
          ? "bg-Primary text-white rounded-lg shadow-sm" 
          : "hover:bg-gray-50 hover:shadow-sm"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className}`}
      onClick={disabled ? undefined : onClick}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <div className={`flex items-center gap-3 w-full h-12 rounded-lg px-4 py-2 transition-all duration-200 ${
        active 
          ? "bg-Primary" 
          : "hover:bg-gray-100"
      }`}>
        {/* Render icon only if it's provided */}
        {icon && (
          <FontAwesomeIcon 
            icon={icon} 
            className={`w-4 h-4 transition-colors duration-200 ${
              active ? "text-white" : "text-gray-600"
            }`} 
          />
        )}
        
        {/* Render avatar only if it's provided */}
        {avatar && (
          <div className="w-6 h-6 rounded-full overflow-hidden">
            <ProfilePicture publicId={avatar} width="24" />
          </div>
        )}
        
        <p className={`font-mulish font-medium text-sm transition-colors duration-200 flex-1 ${
          active 
            ? "text-white" 
            : "text-gray-700"
        }`}>
          {title}
        </p>
      </div>
    </div>
  );
}

NavItem.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.object,
  active: PropTypes.bool,
  onClick: PropTypes.func,
  avatar: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};