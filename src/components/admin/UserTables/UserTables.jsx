//     // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
//     // import TableDistributor from "./DataTable/TableDistributor";


//     // const driverColumns = [
//     //     {
//     //         accessorKey: "driverId",
//     //         header: "Driver ID"
//     //     },
//     //     {
//     //         accessorKey: "name",
//     //         header: "Name"
//     //     },
//     //     {
//     //         accessorKey: "nic",
//     //         header: "NIC"
//     //     },
//     //     {
//     //         accessorKey: "email",
//     //         header: "Email",
//     //     },
//     //     {
//     //         accessorKey: "contactNo",
//     //         header: "Contact"
//     //     },
//     //     {
//     //         accessorKey: "createdAt",
//     //         header: "Joined date"
//     //     },
//     //     {
//     //         accessorKey: "licenseId",
//     //         header: "License Id"
//     //     },
//     //     {
//     //         accessorKey: "branchLocation",
//     //         header: "Branch"
//     //     },
//     //     {
//     //         accessorKey: "branchContactNo",
//     //         header: "Branch Contact"
//     //     },
//     //     {
//     //         accessorKey: "adminName",
//     //         header: "Added Admin"
//     //     },
//     //     // {
//     //     //     accessorKey:"",
//     //     //     header:""
//     //     // },
//     // ];
//     // const staffColumns = [
//     //     // {
//     //     //     accessorKey: "itemId",
//     //     //     header: "Staff ID"
//     //     // },
//     //     {
//     //         accessorKey: "name",
//     //         header: "Name"
//     //     },
//     //     {
//     //         accessorKey: "nic",
//     //         header: "NIC"
//     //     },
//     //     {
//     //         accessorKey: "email",
//     //         header: "Email",
//     //     },
//     //     {
//     //         accessorKey: "contactNo",
//     //         header: "Contact"
//     //     },
//     //     {
//     //         accessorKey: "createdAt",
//     //         header: "Joined date"
//     //     },
//     //     {
//     //         accessorKey: "status",
//     //         header: "Status"
//     //     },
//     //     {
//     //         accessorKey: "branchLocation",
//     //         header: "Branch"
//     //     },
//     //     {
//     //         accessorKey: "adminName",
//     //         header: "Added admin"
//     //     },

//     // ]
//     // const adminColumns = [
//     //     // {
//     //     //     accessorKey: "adminId",
//     //     //     header: "Admin ID"
//     //     // },
//     //     {
//     //         accessorKey: "name",
//     //         header: "Name"
//     //     },
//     //     {
//     //         accessorKey: "nic",
//     //         header: "NIC"
//     //     },
//     //     {
//     //         accessorKey: "email",
//     //         header: "Email",
//     //     },
//     //     {
//     //         accessorKey: "contactNo",
//     //         header: "Contact"
//     //     },
//     //     {
//     //         accessorKey: "createdAt",
//     //         header: "Joined date"
//     //     },
//     // ]
//     // const customerColumns = [
//     //     // {
//     //     //     accessorKey: "userId",
//     //     //     header: "Customer Id"
//     //     // },
//     //     {
//     //         accessorKey: "name",
//     //         header: "Name"
//     //     },
//     //     {
//     //         accessorKey: "nic",
//     //         header: "NIC"
//     //     },
//     //     {
//     //         accessorKey: "email",
//     //         header: "Email",
//     //     },
//     //     {
//     //         accessorKey: "contact",
//     //         header: "Contact"
//     //     },
//     //     {
//     //         accessorKey: "address",
//     //         header: "Address"
//     //     },
//     //     {
//     //         accessorKey: "createdAt",
//     //         header: "Joined date"
//     //     },
//     // ]

//     // const UserTables = () => {
   
//     //     return (
//     //         <div>
//     //             <Tabs defaultValue="customer" className="w-full h-full">
//     //                 <TabsList>
//     //                     <TabsTrigger value="customer">Customer</TabsTrigger>
//     //                     <TabsTrigger value="staff">Staff</TabsTrigger>
//     //                     <TabsTrigger value="driver">Driver</TabsTrigger>
//     //                     <TabsTrigger value="admin">Admin</TabsTrigger>
//     //                 </TabsList>
//     //                 <TabsContent value="customer"><TableDistributor title='customer' columns={customerColumns} disableDateFilter={true} enableRowClick={true}/></TabsContent>
//     //                 <TabsContent value="staff"><TableDistributor title='staff' columns={staffColumns} disableDateFilter={true} enableRowClick={true}/></TabsContent>
//     //                 <TabsContent value="driver"><TableDistributor title='driver' columns={driverColumns} disableDateFilter={true} enableRowClick={true} /></TabsContent>
//     //                 <TabsContent value="admin"><TableDistributor title='admin' columns={adminColumns} disableDateFilter={true} enableRowClick={true}/></TabsContent>
//     //             </Tabs>

//     //         </div>
//     //     )
//     // }

//     // export default UserTables



//     import React, { useMemo } from "react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { AlertTriangle, Users, UserCheck, Truck, Shield } from "lucide-react";
// import TableDistributor from "./DataTable/TableDistributor";

// // Column definitions with better formatting and validation
// const columnDefinitions = {
//   driver: [
//     {
//       accessorKey: "driverId",
//       header: "Driver ID",
//       cell: ({ getValue }) => getValue() || "N/A",
//     },
//     {
//       accessorKey: "name",
//       header: "Name",
//       cell: ({ getValue }) => getValue() || "N/A",
//     },
//     {
//       accessorKey: "nic",
//       header: "NIC",
//       cell: ({ getValue }) => getValue() || "N/A",
//     },
//     {
//       accessorKey: "email",
//       header: "Email",
//       cell: ({ getValue }) => getValue() || "N/A",
//     },
//     {
//       accessorKey: "contactNo",
//       header: "Contact",
//       cell: ({ getValue }) => getValue() || "N/A",
//     },
//     {
//       accessorKey: "createdAt",
//       header: "Joined Date",
//       cell: ({ getValue }) => getValue() || "N/A",
//     },
//     {
//       accessorKey: "licenseId",
//       header: "License ID",
//       cell: ({ getValue }) => getValue() || "N/A",
//     },
//     {
//       accessorKey: "branchLocation",
//       header: "Branch",
//       cell: ({ getValue }) => getValue() || "N/A",
//     },
//     {
//       accessorKey: "branchContactNo",
//       header: "Branch Contact",
//       cell: ({ getValue }) => getValue() || "N/A",
//     },
//     {
//       accessorKey: "adminName",
//       header: "Added By Admin",
//       cell: ({ getValue }) => getValue() || "N/A",
//     },
//   ],
//   staff: [
//     {
//       accessorKey: "staffId",
//       header: "Staff ID",
//       cell: ({ getValue }) => getValue() || "N/A",
//     },
//     {
//       accessorKey: "name",
//       header: "Name",
//       cell: ({ getValue }) => getValue() || "N/A",
//     },
//     {
//       accessorKey: "nic",
//       header: "NIC",
//       cell: ({ getValue }) => getValue() || "N/A",
//     },
//     {
//       accessorKey: "email",
//       header: "Email",
//       cell: ({ getValue }) => getValue() || "N/A",
//     },
//     {
//       accessorKey: "contactNo",
//       header: "Contact",
//       cell: ({ getValue }) => getValue() || "N/A",
//     },
//     {
//       accessorKey: "createdAt",
//       header: "Joined Date",
//       cell: ({ getValue }) => getValue() || "N/A",
//     },
//     {
//       accessorKey: "status",
//       header: "Status",
//       cell: ({ getValue }) => {
//         const status = getValue();
//         return (
//           <span
//             className={`px-2 py-1 rounded-full text-xs font-medium ${
//               status === "active"
//                 ? "bg-green-100 text-green-800"
//                 : status === "inactive"
//                 ? "bg-red-100 text-red-800"
//                 : "bg-gray-100 text-gray-800"
//             }`}
//           >
//             {status || "N/A"}
//           </span>
//         );
//       },
//     },
//     {
//       accessorKey: "branchLocation",
//       header: "Branch",
//       cell: ({ getValue }) => getValue() || "N/A",
//     },
//     {
//       accessorKey: "adminName",
//       header: "Added By Admin",
//       cell: ({ getValue }) => getValue() || "N/A",
//     },
//   ],
//   admin: [
//     {
//       accessorKey: "adminId",
//       header: "Admin ID",
//       cell: ({ getValue }) => getValue() || "N/A",
//     },
//     {
//       accessorKey: "name",
//       header: "Name",
//       cell: ({ getValue }) => getValue() || "N/A",
//     },
//     {
//       accessorKey: "nic",
//       header: "NIC",
//       cell: ({ getValue }) => getValue() || "N/A",
//     },
//     {
//       accessorKey: "email",
//       header: "Email",
//       cell: ({ getValue }) => getValue() || "N/A",
//     },
//     {
//       accessorKey: "contactNo",
//       header: "Contact",
//       cell: ({ getValue }) => getValue() || "N/A",
//     },
//     {
//       accessorKey: "createdAt",
//       header: "Joined Date",
//       cell: ({ getValue }) => getValue() || "N/A",
//     },
//     {
//       accessorKey: "role",
//       header: "Role",
//       cell: ({ getValue }) => {
//         const role = getValue();
//         return (
//           <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
//             {role || "Admin"}
//           </span>
//         );
//       },
//     },
//   ],
//   customer: [
//     {
//       accessorKey: "userId",
//       header: "Customer ID",
//       cell: ({ getValue }) => getValue() || "N/A",
//     },
//     {
//       accessorKey: "name",
//       header: "Name",
//       cell: ({ getValue }) => getValue() || "N/A",
//     },
//     {
//       accessorKey: "nic",
//       header: "NIC",
//       cell: ({ getValue }) => getValue() || "N/A",
//     },
//     {
//       accessorKey: "email",
//       header: "Email",
//       cell: ({ getValue }) => getValue() || "N/A",
//     },
//     {
//       accessorKey: "contact",
//       header: "Contact",
//       cell: ({ getValue }) => getValue() || "N/A",
//     },
//     {
//       accessorKey: "address",
//       header: "Address",
//       cell: ({ getValue }) => {
//         const address = getValue();
//         return (
//           <span className="max-w-xs truncate" title={address}>
//             {address || "N/A"}
//           </span>
//         );
//       },
//     },
//     {
//       accessorKey: "createdAt",
//       header: "Joined Date",
//       cell: ({ getValue }) => getValue() || "N/A",
//     },
//   ],
// };

// // Tab configuration with icons
// const tabConfig = [
//   {
//     value: "customer",
//     label: "Customer",
//     icon: Users,
//     description: "Manage customer accounts and information",
//   },
//   {
//     value: "staff",
//     label: "Staff",
//     icon: UserCheck,
//     description: "Manage staff members and their roles",
//   },
//   {
//     value: "driver",
//     label: "Driver",
//     icon: Truck,
//     description: "Manage delivery drivers and their details",
//   },
//   {
//     value: "admin",
//     label: "Admin",
//     icon: Shield,
//     description: "Manage admin users and permissions",
//   },
// ];

// const UserTables = React.memo(() => {
//   // Memoized column definitions to prevent unnecessary re-renders
//   const memoizedColumns = useMemo(() => columnDefinitions, []);

//   // Error boundary for tab content
//   const TabContentWrapper = ({ children, tabValue }) => {
//     try {
//       return children;
//     } catch (error) {
//       console.error(`Error in ${tabValue} tab:`, error);
//       return (
//         <Alert variant="destructive" className="m-4">
//           <AlertTriangle className="h-4 w-4" />
//           <AlertDescription>
//             Failed to load {tabValue} data. Please try refreshing the page.
//           </AlertDescription>
//         </Alert>
//       );
//     }
//   };

//   return (
//     <div className="w-full h-full bg-gray-50 rounded-lg p-6">
//       <div className="mb-6">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
//         <p className="text-gray-600">
//           Manage all user types including customers, staff, drivers, and administrators
//         </p>
//       </div>

//       <Tabs defaultValue="customer" className="w-full h-full">
//         <TabsList className="grid w-full grid-cols-4 mb-6 bg-white border shadow-sm">
//           {tabConfig.map(({ value, label, icon: Icon }) => (
//             <TabsTrigger
//               key={value}
//               value={value}
//               className="flex items-center space-x-2 py-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200"
//             >
//               <Icon className="h-4 w-4" />
//               <span className="font-medium">{label}</span>
//             </TabsTrigger>
//           ))}
//         </TabsList>

//         {tabConfig.map(({ value, label, description }) => (
//           <TabsContent key={value} value={value} className="mt-0">
//             <TabContentWrapper tabValue={value}>
//               <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200">
//                 <h2 className="text-xl font-semibold text-gray-800 mb-1">
//                   {label} Management
//                 </h2>
//                 <p className="text-gray-600 text-sm">{description}</p>
//               </div>
              
//               <TableDistributor
//                 title={value}
//                 columns={memoizedColumns[value]}
//                 disableDateFilter={true}
//                 enableRowClick={true}
//                 sorting={true}
//                 // Add any additional props specific to each table type
//                 {...(value === "driver" && {
//                   updateEnabled: false,
//                   deleteEnabled: false,
//                 })}
//                 {...(value === "admin" && {
//                   updateEnabled: true,
//                   deleteEnabled: false,
//                 })}
//               />
//             </TabContentWrapper>
//           </TabsContent>
//         ))}
//       </Tabs>
//     </div>
//   );
// });

// UserTables.displayName = "UserTables";

// export default UserTables;

import React, { useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Users, UserCheck, Truck, Shield } from "lucide-react";
import TableDistributor from "./DataTable/TableDistributor";

// Column definitions with better formatting and validation
const columnDefinitions = {
  driver: [
    // {
    //   accessorKey: "driverId",
    //   header: "Driver ID",
    //   cell: ({ getValue }) => getValue() || "N/A",
    // },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "nic",
      header: "NIC",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "contactNo",
      header: "Contact",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "createdAt",
      header: "Joined Date",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    // {
    //   accessorKey: "licenseId",
    //   header: "License ID",
    //   cell: ({ getValue }) => getValue() || "N/A",
    // },
    {
      accessorKey: "branchLocation",
      header: "Branch",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    // {
    //   accessorKey: "branchContactNo",
    //   header: "Branch Contact",
    //   cell: ({ getValue }) => getValue() || "N/A",
    // },
    {
      accessorKey: "adminName",
      header: "Added By Admin",
      cell: ({ getValue }) => getValue() || "N/A",
    },
  ],
  staff: [
    // {
    //   accessorKey: "staffId",
    //   header: "Staff ID",
    //   cell: ({ getValue }) => getValue() || "N/A",
    // },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "nic",
      header: "NIC",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "contactNo",
      header: "Contact",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "createdAt",
      header: "Joined Date",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue();
        return (
          <Badge 
            variant="outline"
            className={`${
              status === "active"
                ? "bg-green-50 text-green-700 border-green-200"
                : status === "inactive"
                ? "bg-red-50 text-red-700 border-red-200"
                : "bg-gray-50 text-gray-700 border-gray-200"
            }`}
          >
            {status || "N/A"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "branchLocation",
      header: "Branch",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "adminName",
      header: "Added By Admin",
      cell: ({ getValue }) => getValue() || "N/A",
    },
  ],
  admin: [
    // {
    //   accessorKey: "adminId",
    //   header: "Admin ID",
    //   cell: ({ getValue }) => getValue() || "N/A",
    // },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "nic",
      header: "NIC",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "contactNo",
      header: "Contact",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "createdAt",
      header: "Joined Date",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ getValue }) => {
        const role = getValue();
        return (
          <Badge 
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            {role || "Admin"}
          </Badge>
        );
      },
    },
  ],
  customer: [
    // {
    //   accessorKey: "userId",
    //   header: "Customer ID",
    //   cell: ({ getValue }) => getValue() || "N/A",
    // },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "nic",
      header: "NIC",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "contact",
      header: "Contact",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    // {
    //   accessorKey: "address",
    //   header: "Address",
    //   cell: ({ getValue }) => {
    //     const address = getValue();
    //     return (
    //       <span 
    //         className="max-w-xs truncate block" 
    //         title={address}
    //       >
    //         {address || "N/A"}
    //       </span>
    //     );
    //   },
    // },
    {
      accessorKey: "createdAt",
      header: "Joined Date",
      cell: ({ getValue }) => getValue() || "N/A",
    },
  ],
};

// Tab configuration with icons and counts
const tabConfig = [
  {
    value: "customer",
    label: "Customers",
    icon: Users,
    description: "Manage customer accounts and information",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    value: "staff",
    label: "Staff",
    icon: UserCheck,
    description: "Manage staff members and their roles",
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  {
    value: "driver",
    label: "Drivers",
    icon: Truck,
    description: "Manage delivery drivers and their details",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
  {
    value: "admin",
    label: "Admins",
    icon: Shield,
    description: "Manage admin users and permissions",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
];

const UserTables = React.memo(() => {
  // Memoized column definitions to prevent unnecessary re-renders
  const memoizedColumns = useMemo(() => columnDefinitions, []);

  // Error boundary for tab content
  const TabContentWrapper = ({ children, tabValue }) => {
    try {
      return children;
    } catch (error) {
      console.error(`Error in ${tabValue} tab:`, error);
      return (
        <Alert variant="destructive" className="m-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load {tabValue} data. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      );
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              User Management
            </h1>
            <p className="text-md text-gray-600 max-w-2xl">
              Comprehensive management system for all user types including customers, 
              staff members, drivers, and administrators
            </p>
          </div>
          
          {/* Quick Stats */}
          {/* <div className="hidden lg:flex space-x-4">
            {tabConfig.map(({ value, label, icon: Icon, color }) => (
              <div 
                key={value}
                className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 min-w-[120px]"
              >
                <div className="flex items-center space-x-2">
                  <Icon className={`h-5 w-5 ${color}`} />
                  <div>
                    <p className="text-sm font-medium text-gray-600">{label}</p>
                    <p className="text-xl font-bold text-gray-900">--</p>
                  </div>
                </div>
              </div>
            ))}
          </div> */}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Tabs defaultValue="customer" className="w-full">
          {/* Enhanced Tabs List */}
          <div className="border-b border-gray-200 bg-gray-50/50">
            <TabsList className="w-full h-auto bg-transparent p-0 space-x-0">
              <div className="flex w-full">
                {tabConfig.map(({ value, label, icon: Icon, color, bgColor, borderColor }) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    className={`
                      flex-1 flex items-center justify-center space-x-3 py-4 px-6
                      bg-transparent border-b-2 border-transparent
                      text-gray-600 font-medium transition-all duration-200
                      hover:text-gray-900 hover:bg-gray-50
                      data-[state=active]:text-gray-900 
                      data-[state=active]:bg-white
                      data-[state=active]:border-blue-500
                      data-[state=active]:shadow-sm
                      first:rounded-tl-xl last:rounded-tr-xl
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-semibold">{label}</span>
                    {/* <Badge 
                      variant="secondary" 
                      className="ml-2 bg-gray-200 text-gray-700 text-xs"
                    >
                      --
                    </Badge> */}
                  </TabsTrigger>
                ))}
              </div>
            </TabsList>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {tabConfig.map(({ value, label, description, icon: Icon, color }) => (
              <TabsContent key={value} value={value} className="mt-0 space-y-6">
                <TabContentWrapper tabValue={value}>
                  {/* Tab Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-gray-50 border border-gray-200`}>
                        <Icon className={`h-6 w-6 ${color}`} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {label} Management
                        </h2>
                        <p className="text-gray-600 mt-1">{description}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      {/* Add any action buttons here */}
                    </div>
                  </div>

                  {/* Table Container */}
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <TableDistributor
                      title={value}
                      columns={memoizedColumns[value]}
                      disableDateFilter={true}
                      enableRowClick={true}
                      sorting={true}
                      // Add any additional props specific to each table type
                      {...(value === "driver" && {
                        updateEnabled: true,
                        deleteEnabled: false,
                      })}
                      {...(value === "admin" && {
                        updateEnabled: true,
                        deleteEnabled: false,
                      })}
                    />
                  </div>
                </TabContentWrapper>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </div>
  );
});

UserTables.displayName = "UserTables";

export default UserTables;