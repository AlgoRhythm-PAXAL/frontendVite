import { DataTable } from "./DataTable"
import { useState, useEffect } from "react"
import axios from 'axios'
import PropTypes from 'prop-types';

const driverColumns=[
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
        accessorKey:"contactNo",
        header:"Contact"
    },
    {
        accessorKey:"createdAt",
        header:"Joined date"
    },
    {
        accessorKey:"licenseId",
        header:"License Id"
    },
    {
        accessorKey:"branchLocation",
        header:"Branch"
    },
    {
        accessorKey:"branchContactNo",
        header:"Branch Contact"
    },
    {
        accessorKey:"adminName",
        header:"Added Admin"
    },
    // {
    //     accessorKey:"",
    //     header:""
    // },
];
const adminColumns=[
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
        accessorKey:"contactNo",
        header:"Contact"
    },
    {
        accessorKey:"createdAt",
        header:"Joined date"
    },
]
const staffColumns=[
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
        accessorKey:"contactNo",
        header:"Contact"
    },
    {
        accessorKey:"createdAt",
        header:"Joined date"
    },
    {
        accessorKey:"status",
        header:"Status"
    },
    {
        accessorKey:"branchLocation",
        header:"Branch"
    },
    {
        accessorKey:"adminName",
        header:"Added admin"
    },
    
]

export default function DemoPage(props) {
    const [data, setData] = useState([]);
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const user=props.title.toLowerCase();
    const formattedUser = user.charAt(0).toUpperCase() + user.slice(1) + 's';

    let apiEndpoint="";
    let columns = [];
    if(user==='driver'|| user==='customer' || user==='staff'){
        apiEndpoint=`${backendURL}/admin/${user}/all`;
    }
    else{
        apiEndpoint=`${backendURL}/${user}/all`;
    }

    if(user==='admin'){
        columns=adminColumns
    }
    else if(user==='driver'){
        columns=driverColumns
    }
    else if(user==='staff'){
        columns=staffColumns
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(apiEndpoint, { withCredentials: true });
                const rawData = response.data.userData;
                const updatedData = rawData.map(item => ({
                    ...item,
                    createdAt: new Date(item.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })
                }));
                console.log(updatedData);
                setData(updatedData);


            } catch (error) {
                console.error(`Error fetching `, error);
            }
        };

        fetchData();
    }, []);


    return (
        <div className="container mx-auto py-10">
            <DataTable title={formattedUser}columns={columns} data={data} />
        </div>
    )
}


// Validate props with PropTypes
DemoPage.propTypes = {
    title: PropTypes.string.isRequired, // title must be a string and is required
  };