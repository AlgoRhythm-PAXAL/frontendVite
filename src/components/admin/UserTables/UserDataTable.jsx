import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import StaffTable from './StaffTable';
import DriverTable from './DriverTable'
import AdminTable from './AdminTable'
import {useState,useEffect} from 'react'
import DemoPage from "./DataTable/DemoPage";

const UserDataTable = () => {

    const [customerData,setCustomerData]=useState([]);
    const [staffData,setStaffData]=useState([]);
    const [driverData,setDriverData]=useState([]);
    const [adminData,setAdminData]=useState([]);

    useEffect(()=>{
        
    },[])


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
                <TabsContent value="staff"><DemoPage title='staff'/></TabsContent>
                <TabsContent value="driver"><DemoPage title='driver'/></TabsContent>
                <TabsContent value="admin"><DemoPage title='admin'/></TabsContent>
            </Tabs>

        </div>
    )
}

export default UserDataTable

