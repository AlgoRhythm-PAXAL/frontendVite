// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// export default function NavItem({ title, icon, active }) {
//   return (
//     <div className={`w-full flex ${active ? "bg-teal-700 text-white rounded-lg" : ""}`}>
//       <div className="flex items-center gap-5 w-full h-12 rounded-lg px-4 py-2 cursor-pointer hover:bg-gray-200 hover:shadow-md transition ">
//         <FontAwesomeIcon icon={icon} className="w-5 h-5" />
//         <p className="font-mulish font-medium text-sm">{title}</p>
//       </div>
//     </div>
//   );
// }


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function NavItem({ title, icon, active, onClick }) {
  return (
    <div 
      className={`w-full flex ${active ? "bg-teal-700 text-white rounded-lg" : ""}`}
      onClick={onClick} // Add this to handle clicks
    >
      <div className="flex items-center gap-5 w-full h-12 rounded-lg px-4 py-2 cursor-pointer hover:bg-gray-200 hover:shadow-md transition">
        <FontAwesomeIcon icon={icon} className="w-5 h-5" />
        <p className="font-mulish font-medium text-sm">{title}</p>
      </div>
    </div>
  );
}
