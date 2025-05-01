import NumberShowingCard from '../NUmberShowingCard';

const UserCount = () => {
  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold mb-6">User Statistics</h1>
      <div className="flex gap-3 justify-between items-center  w-full h-fit ">
        <NumberShowingCard title="Total Customers" type="Customer" />
        <NumberShowingCard title="Total Drivers" type="Driver" />
        <NumberShowingCard title="Total Admins" type="Admin" />
        <NumberShowingCard title="Total Staffs" type="Staff" />
      </div>
    </div>
  );
};

export default UserCount;
