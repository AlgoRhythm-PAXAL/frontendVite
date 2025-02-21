const FormField = ({label,type,name,value,onChange,options}) => {
  return (
    <div>
      <label className="block text-base font-medium font-mulish text-black mb-1">
        {label}
      </label>

      {type === "textarea" ? (
        <textarea name={name} value={value} onChange={onChange} className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300" />
      ) : type === "select" ? (
        <select name={name} value={value} onChange={onChange} className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300" >
          {options?.map((option, index) => (
            <option key={index} value={option.value}> {option.label} </option>
          ))}
        </select>
      ) : (
        <input type={type} name={name} value={value} onChange={onChange} className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300" />
      )}
    </div>
  )
}

export default FormField

// {/* <FormField label="Username" name="username" type="text" value={username} onChange={handleChange} />
// <FormField label="Bio" name="bio" type="textarea" value={bio} onChange={handleChange} />
// <FormField 
//   label="Country" 
//   name="country" 
//   type="select" 
//   value={country} 
//   onChange={handleChange} 
//   options={[{ label: "USA", value: "us" }, { label: "India", value: "in" }]}
// /> */}
