    import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
    import TableDistributor from "./DataTable/TableDistributor";


    const driverColumns = [
        {
            accessorKey: "itemId",
            header: "Driver ID"
        },
        {
            accessorKey: "name",
            header: "Name"
        },
        {
            accessorKey: "nic",
            header: "NIC"
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "contactNo",
            header: "Contact"
        },
        {
            accessorKey: "createdAt",
            header: "Joined date"
        },
        {
            accessorKey: "licenseId",
            header: "License Id"
        },
        {
            accessorKey: "branchLocation",
            header: "Branch"
        },
        {
            accessorKey: "branchContactNo",
            header: "Branch Contact"
        },
        {
            accessorKey: "adminName",
            header: "Added Admin"
        },
        // {
        //     accessorKey:"",
        //     header:""
        // },
    ];
    const staffColumns = [
        {
            accessorKey: "itemId",
            header: "Staff ID"
        },
        {
            accessorKey: "name",
            header: "Name"
        },
        {
            accessorKey: "nic",
            header: "NIC"
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "contactNo",
            header: "Contact"
        },
        {
            accessorKey: "createdAt",
            header: "Joined date"
        },
        {
            accessorKey: "status",
            header: "Status"
        },
        {
            accessorKey: "branchLocation",
            header: "Branch"
        },
        {
            accessorKey: "adminName",
            header: "Added admin"
        },

    ]
    const adminColumns = [
        {
            accessorKey: "itemId",
            header: "Admin ID"
        },
        {
            accessorKey: "name",
            header: "Name"
        },
        {
            accessorKey: "nic",
            header: "NIC"
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "contactNo",
            header: "Contact"
        },
        {
            accessorKey: "createdAt",
            header: "Joined date"
        },
    ]
    const customerColumns = [
        {
            accessorKey: "userId",
            header: "Customer Id"
        },
        {
            accessorKey: "name",
            header: "Name"
        },
        {
            accessorKey: "nic",
            header: "NIC"
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "contact",
            header: "Contact"
        },
        {
            accessorKey: "address",
            header: "Address"
        },
        {
            accessorKey: "createdAt",
            header: "Joined date"
        },
    ]

    const UserTables = () => {
   
        return (
            <div>
                <Tabs defaultValue="customer" className="w-full h-full">
                    <TabsList>
                        <TabsTrigger value="customer">Customer</TabsTrigger>
                        <TabsTrigger value="staff">Staff</TabsTrigger>
                        <TabsTrigger value="driver">Driver</TabsTrigger>
                        <TabsTrigger value="admin">Admin</TabsTrigger>
                    </TabsList>
                    <TabsContent value="customer"><TableDistributor title='customer' columns={customerColumns} disableDateFilter={true} /></TabsContent>
                    <TabsContent value="staff"><TableDistributor title='staff' columns={staffColumns} disableDateFilter={true} /></TabsContent>
                    <TabsContent value="driver"><TableDistributor title='driver' columns={driverColumns} disableDateFilter={true} /></TabsContent>
                    <TabsContent value="admin"><TableDistributor title='admin' columns={adminColumns} disableDateFilter={true} /></TabsContent>
                </Tabs>

            </div>
        )
    }

    export default UserTables

