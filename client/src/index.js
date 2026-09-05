import { AuthProvider } from './context/AuthContext';

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProtectedRoute from './components/security/ProtectedRoute';

// Adding the pages
import HomeScreen from './screens/HomeScreen';
import LoginForm from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import AdminPanel from './components/panels/AdminPanel';
import MedicalStaffPanel from './components/panels/MedicalStaffPanel';
import PatientPanel from './components/panels/PatientPanel';

// Import routing utilities from react-router-dom for handling navigation
import {
  createBrowserRouter,
  createRoutesFromElements, 
  Route,
  RouterProvider,
} from 'react-router-dom'

// Define application routes
// Path '/' is the main layout (App component)
// The index route (path='/') renders LoginForm by default
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/'
    element={<App />}>, children: [
      {/* Default route - shows LoginForm when visiting the root path */}
      <Route index={true} element={<HomeScreen />} />

      {/* Commented routes for future admin panels */}
      <Route path="login" element={<LoginForm />} />
      <Route path="register" element={<RegisterScreen />} />


      <Route path="Administrator" element={
        <ProtectedRoute>
          <AdminPanel />
        </ProtectedRoute>
      } />
      <Route path="MedicalStaff" element={
        <ProtectedRoute>
          <MedicalStaffPanel />
        </ProtectedRoute>
      } />
      <Route path="Patient" element={
        <ProtectedRoute>
          <PatientPanel />
        </ProtectedRoute>
      } />
      <Route path="Profile" element={
        <ProtectedRoute>
          <ProfileScreen />
        </ProtectedRoute>
      } />
    ]
    </Route>
  )
)

// Create root React element and render the application
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Provide router to the entire application */}
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();