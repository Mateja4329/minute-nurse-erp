import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import LoginForm from './screens/LoginForm'
import AdminPanel from './screens/AdminPanel'
import MedicalStaffPanel from './screens/MedicalStaffPanel'
import PatientPanel from './screens/PatientPanel'
import 'bootstrap/dist/css/bootstrap.min.css'
import RegisterScreen from './screens/RegisterScreen'

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
    <Route path='/' element={<App />}>
      {/* Default route - shows LoginForm when visiting the root path */}
      <Route index={true} element={<LoginForm />} />

      {/* Commented routes for future admin panels */}
      <Route path="register" element={<RegisterScreen />} />

      <Route path="Administrator" element={<AdminPanel />} />
      <Route path="MedicalStaff" element={<MedicalStaffPanel />} />
      <Route path="Patient" element={<PatientPanel />} />
    </Route>
  )
)

// Create root React element and render the application
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Provide router to the entire application */}
    <RouterProvider router={router} />
  </React.StrictMode>
);

reportWebVitals();