import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import StaffTable from './StaffTable';
import DriverTable from './DriverTable'
import AdminTable from './AdminTable'

const UserDataTable = () => {
    return (
        <div>
            <Tabs defaultValue="customer" className="w-full h-full">
                <TabsList>
                    <TabsTrigger value="customer">Customer</TabsTrigger>
                    <TabsTrigger value="staff">Staff</TabsTrigger>
                    <TabsTrigger value="driver">Driver</TabsTrigger>
                    <TabsTrigger value="admin">Admin</TabsTrigger>
                </TabsList>
                <TabsContent value="customer">Customer Data </TabsContent>
                <TabsContent value="staff"><StaffTable title="Staff" apiEndpoint="http://localhost:8000/admin/staff/all" /></TabsContent>
                <TabsContent value="driver"><DriverTable title="Drivers" apiEndpoint="http://localhost:8000/admin/driver/all" /></TabsContent>
                <TabsContent value="admin"><AdminTable title="Admins" apiEndpoint="http://localhost:8000/admin/all" /></TabsContent>

                
      
      
            </Tabs>

        </div>
    )
}

export default UserDataTable
