import SectionTitle from '../../components/admin/SectionTitle';
import NumberShowingCard from "../../components/admin/NUmberShowingCard";
import UserRegistrationForm from '../../components/admin/UserRegistrationForm';
import AdminTable from '../../components/admin/AdminTable';
import DriverTable from '../../components/admin/DriverTable';
import StaffTable from '../../components/admin/StaffTable';
import UserDataTable from '../../components/admin/UserDataTable';
import UserCount from "../../components/admin/userCounts/userCount";

const UserAccounts = () => {



  return (
    <div className="flex flex-col  mx-8  ">
      <SectionTitle title="User Accounts" />
      <div className="flex flex-col gap-5 w-full justify-center items-center">
        <UserCount />
        <UserRegistrationForm />



      </div>
      <UserDataTable />

    </div>
  );
};

export default UserAccounts;
