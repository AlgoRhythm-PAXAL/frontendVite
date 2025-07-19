

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import ProfilePicture from "./ImageUpload/ProfilePicture";

// export default function NavItem({ title, icon, active, onClick,avatar }) {
//   return (
//     <div 
//       className={`w-full flex ${active ? "bg-teal-700 text-white rounded-lg" : ""}`}
//       onClick={onClick} // Add this to handle clicks
//     >
//       <div className="flex items-center gap-5 w-full h-12 rounded-lg px-4 py-2 cursor-pointer hover:bg-gray-200 hover:shadow-md transition">
//          {/* Render icon only if it's provided */}
//          {icon && <FontAwesomeIcon icon={icon} className="w-5 h-5" />}
        
//         {/* Render avatar only if it's provided */}
//         {avatar && <ProfilePicture publicId={avatar} width="30" />}
//         <p className="font-mulish font-medium text-sm">{title}</p>
//       </div>
//     </div>
//   );
// }


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProfilePicture from "./ImageUpload/ProfilePicture";

export default function NavItem({ title, icon, active, onClick, avatar, disabled, className }) {
  return (
    <div 
      className={`w-full flex ${
        active 
          ? "bg-teal-700 text-white rounded-lg" 
          : "hover:bg-gray-100 hover:shadow-sm"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className || ""}`}
      onClick={disabled ? undefined : onClick}
    >
      <div className={`flex items-center gap-5 w-full h-12 rounded-lg px-4 py-2 transition-all duration-200 ${
        active 
          ? "" 
          : "hover:bg-gray-200 hover:shadow-md"
      }`}>
        {/* Render icon only if it's provided */}
        {icon && (
          <FontAwesomeIcon 
            icon={icon} 
            className={`w-5 h-5 ${
              active ? "text-white" : "text-gray-600 hover:text-gray-800"
            }`} 
          />
        )}
        
        {/* Render avatar only if it's provided */}
        {avatar && <ProfilePicture publicId={avatar} width="30" />}
        
        <p className={`font-mulish font-medium text-sm transition-colors duration-200 ${
          active 
            ? "text-white" 
            : "text-gray-700 hover:text-gray-900"
        }`}>
          {title}
        </p>
      </div>
    </div>
  );
}