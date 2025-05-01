import MainMenuButton from "../../components/staff/MainMenuButton";
import NavigationBar from "../../components/staff/NavigationBar";
import {
  ClipboardDocumentIcon,
  QueueListIcon,
  TruckIcon,
  ChatBubbleLeftEllipsisIcon,
} from "@heroicons/react/24/outline";

const StaffMainMenu = () => {
  // return (
  //   <>
  //     <NavigationBar />
  //     <div className="flex items-center justify-center h-[90vh]">
  //       <div className="w-[900px] h-[470px] shadow-slate-300 shadow-lg">
  //         <h1 className="text-center font-semibold text-3xl pt-5 pb-10">
  //           Staff Activities
  //         </h1>

  //         <MainMenuButton text="Lodging Management" link="/staff/lodging-management/view-pickups" />
  //         <br />
  //         <MainMenuButton text="Collection Management" link="" />
  //         <br />
  //         <MainMenuButton text="Shipment Management" link="" />
  //         <br />
  //         <MainMenuButton text="Inquiry Management" link="" />
  //       </div>
  //     </div>
  //   </>
  // );

  return (
    <>
      <NavigationBar />
      <div className="min-h-[90vh] flex items-center justify-center bg-gray-50">
        <div className="max-w-4xl w-full mx-4 bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
          <header className="mb-8 border-b pb-6">
            <h1 className="text-3xl font-semibold text-Primary text-center">
              PAXAL - STAFF PORTAL
            </h1>
            <p className="text-center text-gray-500 mt-2">
              Streamline parcel handling and client support
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MainMenuButton
              text="Lodging Management"
              link="/staff/lodging-management/view-pickups"
              icon={<ClipboardDocumentIcon className="w-6 h-6" />}
            />
            <MainMenuButton
              text="Collection Management"
              link="#"
              icon={<QueueListIcon className="w-6 h-6" />}
            />
            <MainMenuButton
              text="Shipment Management"
              link="#"
              icon={<TruckIcon className="w-6 h-6" />}
            />
            <MainMenuButton
              text="Inquiry Management"
              link="/staff/inquiry-management/view-new-inquiries"
              icon={<ChatBubbleLeftEllipsisIcon className="w-6 h-6" />}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default StaffMainMenu;
