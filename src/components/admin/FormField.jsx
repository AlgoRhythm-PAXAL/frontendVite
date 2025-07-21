const FormField = ({
    label,
    type,
    name,
    value,
    onChange,
    options = [],
    placeholder,
    required = false,
    pattern
  }) => {
    // Convert to boolean explicitly (handles string "true"/"false" cases safely)
    const isRequired = required === true || required === "true";
  
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
  
        {type === "select" ? (
          <select name={name} value={value} onChange={onChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg 
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       transition-all outline-none"
            required={isRequired}
          >
            {options.map((option, index) => (
              <option
                key={index}
                value={option.value}
                disabled={option.value === ""}
                className="text-gray-700"
              >
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} required={isRequired} pattern={pattern}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg 
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       transition-all outline-none"
          />
        )}
      </div>
    );
  };
  
  export default FormField;
  