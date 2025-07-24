// import { createContext, useState, useEffect } from 'react';
// import axios from 'axios';


// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);


 

//   useEffect(() => {
//     const checkAuth = async () => {
//       const storedAuth = localStorage.getItem('isAuthenticated');
//       if (storedAuth === 'true') {
//         try {
//           await fetchUser(); // Validate token
//           setIsAuthenticated(true);
//         } catch (error) {
//           console.error('Session expired:', error);
//           logout(); // Clear invalid session
//         }
//       }
//       setLoading(false); // Auth check complete
//     };

//     checkAuth();
//   }, []);

//   const fetchUser = async () => {
//     try {
//       const response = await axios.get(
//         'http://localhost:8000/api/auth/profile',
//         {
//           withCredentials: true,
//         }
//       );

//       console.log('Fetched user:', response.data);
//       setUser(response.data.data.user); 
//     } catch (error) {
//       console.error('Fetch user failed:', error.message);
//     }
//   };

//   // Function to login and update state
//   const login = async () => {
//     setIsAuthenticated(true);
//     localStorage.setItem('isAuthenticated', 'true');
//     await fetchUser(); // Fetch user after login
//   };

//   // Function to logout and update state
//   const logout = async () => {
//     try {
//       await axios.post('http://localhost:8000/api/auth/logout', {
//         withCredentials: true,
//       });

//       // Clear authentication state
//       setIsAuthenticated(false);
//       setUser(null);
//       localStorage.removeItem('isAuthenticated');

//       // Optionally, redirect user to login page
//       window.location.href = '/'; // Redirect to login after logout
//     } catch (error) {
//       console.error(
//         'Logout failed:',
//         error.response?.data?.message || error.message
//       );
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First try to fetch user - this will validate the session
        const userData = await fetchUser();
        if (userData) {
          setIsAuthenticated(true);
          setUser(userData);
        } else {
          logout(false); // Don't redirect during initial check
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        logout(false); // Don't redirect during initial check
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8000/api/auth/profile',
        { withCredentials: true }
      );
      return response.data.data.user;
    } catch (error) {
      console.error('Fetch user failed:', error);
      throw error; // Re-throw to handle in checkAuth
    }
  };

  const login = async () => {
    try {
      const userData = await fetchUser();
      setIsAuthenticated(true);
      setUser(userData);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        'http://localhost:8000/api/auth/logout',
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error('Logout API failed:', error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
   
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// PropTypes validation
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};