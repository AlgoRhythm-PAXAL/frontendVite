const StatsBox = ({ title, value }) => (
  <div
    className="flex-1 max-w-[220px] bg-white border border-gray-100 rounded-xl p-4 
                  transition-all duration-300 hover:shadow-lg hover:border-Primary/30"
  >
    <p className="text-sm text-gray-500 mb-2">{title}</p>
    <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
  </div>
);

export default StatsBox;
