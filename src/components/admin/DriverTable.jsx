import { useEffect, useState } from "react";
import axios from "axios";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHeader,
    TableRow,
    TableHead,
} from "@/components/ui/table";
import StickyHeadTable from "./MUITable";

const AdminTable = ({ title, apiEndpoint }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(apiEndpoint, { withCredentials: true });
                console.log(`API Response for ${title}:`, response.data.DriverData);
                const driverData=response.data.DriverData;
                
                    setData(driverData);
                
            } catch (error) {
                console.error(`Error fetching ${title}:`, error);
            }
        };

        fetchData();
    }, [apiEndpoint, title]);

    // Get table headers dynamically
    const headers = data.length > 0 ? Object.keys(data[0]) : [];

    return (
        <div className="w-full flex flex-col justify-center  p-2  bg-white rounded-2xl border border-gray-300 shadow-lg">
            <h1>Driver table</h1>
            {/* <Table>
                <TableCaption>A list of {title}</TableCaption>
                <TableHeader>
                    <TableRow>
                        {headers.map((header, index) => (
                            <TableHead key={index} className="uppercase">
                                {header}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {headers.map((header, colIndex) => (
                                <TableCell key={colIndex}>{item[header]}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={headers.length}>Total {title}: {data.length}</TableCell>
                    </TableRow>
                </TableFooter>
            </Table> */}

           
            <StickyHeadTable data={data} headers={headers}/>
            
        </div>
        
    );
};

export default AdminTable;
