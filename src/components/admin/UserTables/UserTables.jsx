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
                        updateEnabled: false,
                        deleteEnabled: false,
                      })}
                      {...(value === "admin" && {
                        updateEnabled: false,
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