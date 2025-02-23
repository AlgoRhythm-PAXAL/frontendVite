import axios from 'axios'


const Hello = () => {

    const fetchData = async () => {
        try {
            const response = await axios.get("http://localhost:8000/admin/all",{withCredentials:true}); 
            console.log("Data fetched successfully:", response.data);
            console.log(response);
            return response.data; // Return fetched data
        } catch (error) {
            console.error("Error fetching data:", error);
            return error;
        }
    };
   
    console.log( fetchData());
  return (
    <div>Hello</div>
  )
}

export default Hello