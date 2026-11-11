import { createContext, useState, useEffect, useContext } from 'react'
import axios from 'axios'

export const AuthContext = createContext()

// ============================================================================
// 🚨 ARCHITECTURE WARNING (INFINITE LOOP AVOIDANCE):
// The Axios instance MUST be declared OUTSIDE the component (here in the global scope).
// If placed inside an AuthProvider, React will render on every render (eg when 
// call setUser or setToken) recreate a brand new object in memory.
// If that new object is found in the useEffect dependencies, React will think it has
// "changed something" and trigger calls to the base again, making an infinite loop!
// So we only instantiate it once here:
// ============================================================================
export const api = axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true // This is crucial for sending cookies.
})

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [loading, setLoading] = useState(true)

    // while the app is loading, try refreshing the token
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await api.post('/api/user/Refresh')
                const newAccessToken = response.data.access_token

                setToken(newAccessToken)
                api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`

                // after we get his token THEN we get the user data
                const profileResponse = await api.get('/api/user/Profile')
                setUser(profileResponse.data) // now we add the user into the memory
            }
            catch (error) { // if there are no cookies or expired cookies
                console.log("Not logged in");
                setUser(null);
            }
            finally {
                setLoading(false)
            }
        }
        checkAuth()
    }, [])

    // function for LoginForm.jsx
    const login = async (userData, accessToken) => {
        setUser(userData)
        setToken(accessToken)
        // now we add the token to header for all the future requests (Axios requests, same thing)
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
    }

    // function for future LogoutForm.jsx (when I add it)
    const logout = async () => {
        try {
            await api.post('/api/user/Logout')
        }
        catch(e) {
            console.error(e)
        }

        setUser(null);
        setToken(null);
        delete api.defaults.headers.common['Authorization'];
    }

    return (
        <AuthContext.Provider value={{ user, setUser, token, loading, login, logout, api}}>
            {children}
        </AuthContext.Provider>
    )
}

// Custom hook to use in other components to access the AuthContext
export const useAuth = () => useContext(AuthContext);