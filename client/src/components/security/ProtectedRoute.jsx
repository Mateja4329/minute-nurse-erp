import React from 'react';
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ProtectedRoute = ({ children }) => {
    // Get the user from the AuthContext
    const { user, loading } = useAuth()

    // While the app is loading, we don't want to redirect the user yet
    if (loading) {
        return <div className="text-center mt-5">Loading...</div>
    }

    // If the loading is done and the user is not logged in, redirect to the login page
    if (!user) {
        return <Navigate to="/login" replace={true} />
    }

    // If the user is logged in, render the children components
    return children
}

export default ProtectedRoute;