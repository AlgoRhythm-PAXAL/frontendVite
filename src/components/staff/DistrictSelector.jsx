const DistrictSelector = ({
  register,
  name,
  required,
  errors,
  selectedProvince,
}) => {
  const districts = [
    { value: "Ampara", label: "Ampara", province: "Eastern Province" },
    {
      value: "Anuradhapura",
      label: "Anuradhapura",
      province: "North Central Province",
    },
    { value: "Badulla", label: "Badulla", province: "Uva Province" },
    { value: "Batticaloa", label: "Batticaloa", province: "Eastern Province" },
    { value: "Colombo", label: "Colombo", province: "Western Province" },
    { value: "Galle", label: "Galle", province: "Southern Province" },
    { value: "Gampaha", label: "Gampaha", province: "Western Province" },
    { value: "Hambantota", label: "Hambantota", province: "Southern Province" },
    { value: "Jaffna", label: "Jaffna", province: "Northern Province" },
    { value: "Kalutara", label: "Kalutara", province: "Western Province" },
    { value: "Kandy", label: "Kandy", province: "Central Province" },
    { value: "Kegalle", label: "Kegalle", province: "Sabaragamuwa Province" },
    {
      value: "Kilinochchi",
      label: "Kilinochchi",
      province: "Northern Province",
    },
    {
      value: "Kurunegala",
      label: "Kurunegala",
      province: "North Western Province",
    },
    { value: "Mannar", label: "Mannar", province: "Northern Province" },
    { value: "Matale", label: "Matale", province: "Central Province" },
    { value: "Matara", label: "Matara", province: "Southern Province" },
    { value: "Monaragala", label: "Monaragala", province: "Uva Province" },
    { value: "Mullaitivu", label: "Mullaitivu", province: "Northern Province" },
    {
      value: "Nuwara Eliya",
      label: "Nuwara Eliya",
      province: "Central Province",
    },
    {
      value: "Polonnaruwa",
      label: "Polonnaruwa",
      province: "North Central Province",
    },
    {
      value: "Puttalam",
      label: "Puttalam",
      province: "North Western Province",
    },
    {
      value: "Ratnapura",
      label: "Ratnapura",
      province: "Sabaragamuwa Province",
    },
    {
      value: "Trincomalee",
      label: "Trincomalee",
      province: "Eastern Province",
    },
    { value: "Vavuniya", label: "Vavuniya", province: "Northern Province" },
  ].sort((a, b) => a.label.localeCompare(b.label));

  const filteredDistricts = districts.filter(
    (district) => district.province === selectedProvince
  );

  return (
    <div className="w-full">
      <select
        disabled={!selectedProvince}
        {...register(name, { required })}
        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:Primary focus:border-Primary"
      >
        <option value="">Select a District</option>
        {filteredDistricts.map((dist) => (
          <option key={dist.value} value={dist.value}>
            {dist.label}
          </option>
        ))}
      </select>
      {errors?.[name] && (
        <p className="mt-1 text-sm text-red-600">This field is required</p>
      )}
    </div>
  );
};

export default DistrictSelector;
