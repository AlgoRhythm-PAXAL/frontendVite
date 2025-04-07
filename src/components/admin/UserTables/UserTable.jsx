import { useEffect, useState } from "react";
import axios from "axios";
import StickyHeadTable from "../MUITable";

const UserTable = ({ title}) => {
    const [data, setData] = useState([]);
    const backendURL=import.meta.env.VITE_BACKEND_URL;
    
    let apiEndpoint="";
    if(title==='driver'|| title==='customer' || title==='staff'){
        apiEndpoint=`${backendURL}/admin/${title}/all`;
    }
    else{
        apiEndpoint=`${backendURL}/${title.toLowerCase()}/all`;
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(apiEndpoint, { withCredentials: true });
                const Data=response.data.adminData;
                console.log(`API Response`, Data);
                setData(Data)
               
            } catch (error) {
                console.error(`Error fetching ${title}:`, error);
            }
        };


        fetchData();
    }, [title]);

    // Get table headers dynamically

    const headers = data.length > 0 ? Object.keys(data[0]) : [];

    return (
        <div className="w-full flex flex-col justify-center  p-2  bg-white rounded-2xl border border-gray-300 shadow-lg">
            <h1>Staff Details</h1>
            <StickyHeadTable data={data} headers={headers}onDelete={(row) => handleDelete(row.id)} />
        </div>
    );
};

export default UserTable;
