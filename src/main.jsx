import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { ConditionalAuthProvider } from './contexts/ConditionalAuthProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ConditionalAuthProvider>
        <App />
      </ConditionalAuthProvider>
    </BrowserRouter>
  </StrictMode>
);

// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom';
// import './index.css';
// import App from './App.jsx';
// import { ConditionalAuthProvider } from './contexts/ConditionalAuthProvider.jsx';

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <BrowserRouter>
//       <ConditionalAuthProvider>
//         <App />
//       </ConditionalAuthProvider>
//     </BrowserRouter>
//   </StrictMode>
// );

