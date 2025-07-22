import SectionTitle from '../../components/admin/SectionTitle';
import UserRegistrationForm from '../../components/admin/UserRegistrationForm';
import UserTables from '../../components/admin/UserTables/UserTables';
import UserCount from "../../components/admin/userCounts/UserCount";
//Fixed import path for UserCount


const UserAccounts = () => {



  return (
    <div className="flex flex-col gap-5 mx-8 mb-10 ">
      <SectionTitle title="User Accounts" />
      <div className="flex flex-col gap-5 w-full justify-center items-center">
        <UserCount />
      </div>
      <UserTables />
      <UserRegistrationForm />
    </div>
  );
};

export default UserAccounts;
