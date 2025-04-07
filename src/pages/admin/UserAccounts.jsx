import SectionTitle from '../../components/admin/SectionTitle';
import NumberShowingCard from "../../components/admin/NUmberShowingCard";
import UserRegistrationForm from '../../components/admin/UserRegistrationForm';

import DriverTable from '../../components/admin/UserTables/DriverTable';
import StaffTable from '../../components/admin/UserTables/StaffTable';
import UserDataTable from '../../components/admin/UserTables/UserDataTable';
import UserCount from "../../components/admin/userCounts/userCount";
import UserTable from '../../components/admin/UserTables/UserTable';
import DemoPage from '../../components/admin/UserTables/DataTable/DemoPage';

const UserAccounts = () => {



  return (
    <div className="flex flex-col  mx-8  ">
      <SectionTitle title="User Accounts" />
      <div className="flex flex-col gap-5 w-full justify-center items-center">
        
      {/* <UserTable title="Admin" /> */}
        <UserCount />
        <UserRegistrationForm />



      </div>
      <UserDataTable />

    </div>
  );
};

export default UserAccounts;
