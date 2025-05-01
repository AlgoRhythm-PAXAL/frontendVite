const ProvinceSelector = ({ register, name, required, errors, onChange }) => {
  const options = [
    { value: "Central Province", label: "Central Province" },
    { value: "Eastern Province", label: "Eastern Province" },
    { value: "Northern Province", label: "Northern Province" },
    { value: "Southern Province", label: "Southern Province" },
    { value: "Western Province", label: "Western Province" },
    { value: "North Western Province", label: "North Western Province" },
    { value: "North Central Province", label: "North Central Province" },
    { value: "Uva Province", label: "Uva Province" },
    { value: "Sabaragamuwa Province", label: "Sabaragamuwa Province" },
  ].sort((a, b) => a.label.localeCompare(b.label));

  return (
    <div className="w-full">
      <select
        {...register(name, { required })}
        onChange={onChange}
        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:Primary focus:border-Primary"
      >
        <option value="">Select a Province</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errors?.[name] && (
        <p className="mt-1 text-sm text-red-600">This field is required</p>
      )}
    </div>
  );
};

export default ProvinceSelector;
