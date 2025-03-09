import SectionTitle from '../../components/admin/SectionTitle';
import NumberShowingCard from "../../components/admin/NUmberShowingCard";
import UserRegistrationForm from '../../components/admin/UserRegistrationForm';
import AdminTable from '../../components/admin/AdminTable';
import DriverTable from '../../components/admin/DriverTable';
import StaffTable from '../../components/admin/StaffTable';

const UserAccounts = () => {



  return (
    <div className="flex flex-col  mx-8  ">
      <SectionTitle title="User Accounts" />
      <div className="flex gap-5 w-full justify-center">
        <UserRegistrationForm />


        <div className="flex flex-wrap justify-center items-stretch gap-2 w-5/12 h-5/6">
          <NumberShowingCard title="Total Customers" number="1000" since="last year" type="Customer" />
          <NumberShowingCard title="Total Drivers" number="1000" since="last year" type="Driver" />
          <NumberShowingCard title="Total Admins" number="1000" since="last year" type="Admin" />
          <NumberShowingCard title="Total Staffs" number="1000" since="last year" type="Staff" />
        </div>
      </div>
      <AdminTable title="Admins" apiEndpoint="http://localhost:8000/admin/all" />
      <StaffTable title="Staff" apiEndpoint="http://localhost:8000/admin/staff/all" />
      <DriverTable title="Drivers" apiEndpoint="http://localhost:8000/admin/driver/all" />
    </div>
  );
};

export default UserAccounts;
