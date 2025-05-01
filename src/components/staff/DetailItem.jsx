
const DetailItem = ({ label, value, fullWidth }) => (
  <div className={`${fullWidth ? 'col-span-2' : ''}`}>
    <dt className="text-sm font-medium text-gray-500 mb-1">{label}</dt>
    <dd className="text-gray-900 font-[500] break-words">{value || '-'}</dd>
  </div>
);

export default DetailItem;