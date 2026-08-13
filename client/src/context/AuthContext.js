import { createContext, useState, useEffect, useContext } from 'react'
import axios from 'axios'

export const AuthContext = createContext()

export const AuthProvider = ({ children}) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [loading, setLoading] = useState(true)

    // very important for sending cookies with every request.
    const api = axios.create({
        baseURL: "http://localhost:8000",
        withCredentials: true // This is crucial for sending cookies.
    })

    // while the app is loading, try refreshing the token
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await api.post('/api/user/Refresh')

                const newAccessToken = response.data.access_token
                setToken(newAccessToken)

                api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`
            }
            catch (error) { // if there are no cookies or expired cookies
                console.log("Not logged in");
            }
            finally {
                setLoading(false)
            }
        }
        checkAuth()
    }, [api])

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
            // now we need to call the backend to clean the cookies
            // (will have to add api/user/Logout on the backend soon)
            // await api.post('/api/user/Logout')
        }
        catch(e) {
            console.error(e)
        }

        setUser(null);
        setToken(null);
        delete api.defaults.headers.common['Authorization'];
    }

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, api}}>
            {children}
        </AuthContext.Provider>
    )
}

// Custom hook to use in other components to access the AuthContext
export const useAuth = () => useContext(AuthContext);