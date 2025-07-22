import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const Logout = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      await logout();
      navigate('/login'); // ✅ React-friendly redirect
    };
    handleLogout();
  }, []);

  return <div>Logging out...</div>;
};

export default Logout;
