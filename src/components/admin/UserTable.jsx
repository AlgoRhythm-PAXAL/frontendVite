// UserTable.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import StickyHeadTable from "./MUITable";

const UserTable = ({ title, apiEndpoint, dataTransformer }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(apiEndpoint, { withCredentials: true });
                
                // Handle API response structure
                const responseData = response.data;
                
                // First check if the response is an array
                if (Array.isArray(responseData)) {
                    setData(dataTransformer(responseData));
                }
                // Then check for common data properties
                else if (responseData.data) {
                    setData(dataTransformer(responseData.data));
                }
                else if (responseData[title.toLowerCase()]) {
                    setData(dataTransformer(responseData[title.toLowerCase()]));
                }
                else {
                    throw new Error("Unexpected API response structure");
                }
            } catch (error) {
                setError(error.message);
                console.error(`Error fetching ${title}:`, error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [apiEndpoint, title, dataTransformer]);

    const headers = data.length > 0 ? Object.keys(data[0]) : [];

    if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
    if (loading) return <div className="p-4">Loading...</div>;

    return (
        <div className="w-full flex flex-col p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">{title} Details</h2>
            <StickyHeadTable data={data} headers={headers} />
        </div>
    );
};

export default UserTable;