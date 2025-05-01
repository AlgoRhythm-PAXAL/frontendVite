import MainMenuButton from '../../components/staff/MainMenuButton';
import NavigationBar from '../../components/staff/NavigationBar';

const StaffMainMenu = () => {
  return (
    <>
      <NavigationBar />
      <div className="flex items-center justify-center h-[90vh]">
        <div className="w-[900px] h-[470px] shadow-slate-300 shadow-lg">
          <h1 className="text-center font-semibold text-3xl pt-5 pb-10">
            Staff Activities
          </h1>

          <MainMenuButton text="Lodging Management" link="" />
          <br />
          <MainMenuButton text="Collection Management" link="" />
          <br />
          <MainMenuButton text="Shipment Management" link="" />
          <br />
          <MainMenuButton text="Inquiry Management" link="" />
        </div>
      </div>
    </>
  );
};

export default StaffMainMenu;
