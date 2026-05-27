import './App.css';
import React from 'react'
import {Outlet} from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  return (
    // <> and </> are called React Fragments. 
    // A component in React must always return ONLY ONE main element. 
    // Fragments help us to group Header, Main and Footer without creating unnecessary <div> tags.
    <>
      <Header />

      {/* The main content of the application. 
          minHeight: '80vh' is CSS that says: "Take up at least 80% of the screen height".
          We do this so that the Footer does not jump to the middle of the screen if there
          is not a lot of text on the page. */}
      <main className='py-3' style={{ minHeight: '80vh' }}>
        <div className='container'>
          {/* Outlet renders child routes (e.g., LoginForm) based on current path */}
          <Outlet />
        </div>
      </main>

      <Footer />
    </>
  );
}

export default App;

// <Outlet /> is the "hole" in our mold. 
// Everything above (Header) and everything below (Footer) will ALWAYS stay on the screen.
// And instead of <Outlet />, React Router will insert LoginForm, AdminPanel or PatientPanel, 
// depending on which link the user is on.