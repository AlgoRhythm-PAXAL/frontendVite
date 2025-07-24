import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AuthProvider } from './AuthContext.jsx';
import { AdminAuthProvider } from './AdminAuthContext.jsx';
import { StaffAuthProvider } from './StaffAuthContext.jsx';

export const ConditionalAuthProvider = ({ children }) => {
  const location = useLocation();
  const pathname = location.pathname;

  // Determine which auth provider to use based on route
  if (pathname.startsWith('/admin')) {
    return (
      <AdminAuthProvider>
        {children}
      </AdminAuthProvider>
    );
  } else if (pathname.startsWith('/staff')) {
    return (
      <StaffAuthProvider>
        {children}
      </StaffAuthProvider>
    );
  } else {
    // Customer/User routes
    return (
      <AuthProvider>
        {children}
      </AuthProvider>
    );
  }
};

ConditionalAuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
