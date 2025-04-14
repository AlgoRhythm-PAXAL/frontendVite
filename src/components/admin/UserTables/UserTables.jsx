import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {useState,useEffect} from 'react'
import DemoPage from "./DataTable/DemoPage";

const UserTables = () => {

    
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
                <TabsContent value="customer"><DemoPage title='customer' disableDateFilter={true}/></TabsContent>
                <TabsContent value="staff"><DemoPage title='staff' disableDateFilter={true}/></TabsContent>
                <TabsContent value="driver"><DemoPage title='driver' disableDateFilter={true}/></TabsContent>
                <TabsContent value="admin"><DemoPage title='admin' disableDateFilter={true}/></TabsContent>
            </Tabs>

        </div>
    )
}

export default UserTables

