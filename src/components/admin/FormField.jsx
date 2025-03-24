// const FormField = ({label,type,name,value,onChange,options,placeholder,required}) => {
//   return (
//     <div className="flex flex-col gap-2 w-full">
//       <label className="block text-base font-medium font-mulish text-black mb-1">
//         {label}
//       </label>

//       {type === "textarea" ? (
//         <textarea name={name} value={value} onChange={onChange} className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300" placeholder={placeholder} required={required} />
//       ) : type === "select" ? (
//         <select name={name} value={value} onChange={onChange} className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300" placeholder={placeholder} >
//           {options?.map((option, index) => (
//             <option key={index} value={option.value}> {option.label} </option>
//           ))}
//         </select>
//       ) : (
//         <input type={type} name={name} value={value} onChange={onChange} className="w-full border border-gray-300 rounded-lg p-2  " placeholder={placeholder}  required={required}/>
//       )}
//     </div>
//   )
// }

// export default FormField


const FormField = ({label, type, name, value, onChange, options, placeholder, required}) => {
  // Fallback for default value if value is undefined or empty
  const defaultValue = value || placeholder;

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="block text-base font-medium font-mulish text-black mb-1">
        {label}
      </label>

      {type === "textarea" ? (
        <textarea 
          name={name} 
          value={value} 
          onChange={onChange} 
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300" 
          placeholder={placeholder} 
          required={required} 
        />
      ) : type === "select" ? (
        <select 
          name={name} 
          value={defaultValue}  // Ensure select shows the correct default value
          onChange={onChange} 
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300"
          required={required}  // Mark as required if specified
        >
          <option value="" disabled>{placeholder || "Select an option"}</option>  {/* Placeholder for select */}
          {options?.map((option, index) => (
            <option key={index} value={option.value}> {option.label} </option>
          ))}
        </select>
      ) : (
        <input 
          type={type} 
          name={name} 
          value={defaultValue}  // Handle default value for other input types
          onChange={onChange} 
          className="w-full border border-gray-300 rounded-lg p-2" 
          placeholder={placeholder} 
          required={required}
        />
      )}
    </div>
  );
}

export default FormField;
