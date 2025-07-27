// Quick Profile Picture Debug Test
// Add this to your Sidebar.jsx temporarily to debug the issue

import axios from 'axios';

// Test function to debug profile picture loading
const debugProfilePicture = async () => {
  console.log("=== PROFILE PICTURE DEBUG TEST ===");
  
  // 1. Check environment variables
  console.log("1. Environment Variables:");
  console.log("   VITE_BACKEND_URL:", import.meta.env.VITE_BACKEND_URL);
  console.log("   VITE_CLOUD_NAME:", import.meta.env.VITE_CLOUD_NAME);
  console.log("   Environment mode:", import.meta.env.MODE);
  
  try {
    // 2. Test API call
    console.log("2. Testing API call to /api/admin/profile...");
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/profile`, {
      withCredentials: true,
      timeout: 10000,
    });
    
    console.log("   API Response:", response.data);
    console.log("   Profile data:", response.data.myData);
    console.log("   profilePicLink:", response.data.myData?.profilePicLink);
    console.log("   profilePicLink type:", typeof response.data.myData?.profilePicLink);
    
    // 3. Test Cloudinary URL generation
    const publicId = response.data.myData?.profilePicLink;
    const cloudName = import.meta.env.VITE_CLOUD_NAME;
    
    if (publicId && cloudName) {
      const testUrl = `https://res.cloudinary.com/${cloudName}/image/upload/c_fill,g_face,w_32,h_32,q_auto,f_auto/${publicId}`;
      console.log("3. Generated Cloudinary URL:", testUrl);
      
      // Test if image loads
      const img = new Image();
      img.onload = () => console.log("   ✅ Image loads successfully!");
      img.onerror = (e) => console.log("   ❌ Image failed to load:", e);
      img.src = testUrl;
    } else {
      console.log("3. ❌ Cannot generate URL - missing publicId or cloudName");
    }
    
  } catch (error) {
    console.error("❌ API call failed:", error);
    console.log("   Status:", error.response?.status);
    console.log("   Data:", error.response?.data);
  }
  
  console.log("=== END DEBUG TEST ===");
};

// Export or call this function from your component
export default debugProfilePicture;

// To use: Add this to your Sidebar component and call it on mount
// useEffect(() => {
//   debugProfilePicture();
// }, []);
