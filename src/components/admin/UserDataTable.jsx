// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import StaffTable from './StaffTable';
// import DriverTable from './DriverTable'
// import AdminTable from './AdminTable'

// const UserDataTable = () => {
//     return (
//         <div>
//             <Tabs defaultValue="customer" className="w-full h-full">
//                 <TabsList>
//                     <TabsTrigger value="customer">Customer</TabsTrigger>
//                     <TabsTrigger value="staff">Staff</TabsTrigger>
//                     <TabsTrigger value="driver">Driver</TabsTrigger>
//                     <TabsTrigger value="admin">Admin</TabsTrigger>
//                 </TabsList>
//                 <TabsContent value="customer">Customer Data </TabsContent>
//                 <TabsContent value="staff"><StaffTable title="Staff" apiEndpoint="http://localhost:8000/admin/staff/all" /></TabsContent>
//                 <TabsContent value="driver"><DriverTable title="Drivers" apiEndpoint="http://localhost:8000/admin/driver/all" /></TabsContent>
//                 <TabsContent value="admin"><AdminTable title="Admins" apiEndpoint="http://localhost:8000/admin/all" /></TabsContent>

                
      
      
//             </Tabs>

//         </div>
//     )
// }

// export default UserDataTable


// UserDataTable.jsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserTable from "./UserTable";

// Data transformers with proper error handling
const userTransformers = {
    admin: (data) => {
        if (!Array.isArray(data)) return [];
        return data.map(({ password, _id, updatedAt, __v, ...rest }) => rest);
    },
    staff: (data) => {
        if (!Array.isArray(data)) return [];
        return data.map(item => ({
            ...item,
            branchLocation: item.branchId?.location || "N/A",
            adminContact: item.adminId?.contactNo || "N/A",
            _id: undefined,
            password: undefined,
            updatedAt: undefined,
            __v: undefined
        }));
    },
    driver: (data) => {
        if (!Array.isArray(data)) return [];
        return data.map(({ _id, password, updatedAt, __v, ...rest }) => ({
            ...rest,
            licenseId: rest.licenseId || "N/A",
            branch: rest.branchId?.location || "N/A"
        }));
    },
    customer: (data) => {
        if (!Array.isArray(data)) return [];
        return data.map(({ password, _id, ...rest }) => rest);
    }
};

const UserDataTable = () => {
    const userTypes = [
        { 
            value: "customer", 
            label: "Customer", 
            endpoint: "http://localhost:8000/admin/customer/all",
            transformer: userTransformers.customer
        },
        { 
            value: "staff", 
            label: "Staff", 
            endpoint: "http://localhost:8000/admin/staff/all",
            transformer: userTransformers.staff
        },
        { 
            value: "driver", 
            label: "Driver", 
            endpoint: "http://localhost:8000/admin/driver/all",
            transformer: userTransformers.driver
        },
        { 
            value: "admin", 
            label: "Admin", 
            endpoint: "http://localhost:8000/admin/all",
            transformer: userTransformers.admin
        }
    ];

    return (
        <div className="w-full h-full p-4 bg-white rounded-xl shadow-sm">
            <Tabs defaultValue="customer">
                <TabsList className="grid grid-cols-4 gap-2 w-full">
                    {userTypes.map((type) => (
                        <TabsTrigger 
                            key={type.value} 
                            value={type.value}
                            className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-600"
                        >
                            {type.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {userTypes.map((type) => (
                    <TabsContent key={type.value} value={type.value} className="mt-4">
                        <UserTable
                            title={type.label}
                            apiEndpoint={type.endpoint}
                            dataTransformer={type.transformer}
                        />
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
};

export default UserDataTable;