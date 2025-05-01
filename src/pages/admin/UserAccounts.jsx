import SectionTitle from '../../components/admin/SectionTitle';
import UserRegistrationForm from '../../components/admin/UserRegistrationForm';
import UserTables from '../../components/admin/UserTables/UserTables';
import UserCount from '../../components/admin/userCounts/userCount';

const UserAccounts = () => {
  return (
    <div className="flex flex-col  mx-8  ">
      <SectionTitle title="User Accounts" />

      <div className="flex flex-col gap-5 w-full justify-center items-center">
        <UserCount />
        <UserRegistrationForm />
      </div>
      <UserTables />
    </div>
  );
};

export default UserAccounts;
