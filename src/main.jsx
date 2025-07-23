import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { AdminAuthProvider } from './contexts/AdminAuthContext.jsx';


createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <AdminAuthProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </AdminAuthProvider>
  </AuthProvider>
);
