import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/index'; // Ensure this points to your axios instance

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in on app load
    useEffect(() => {
        const checkUser = async () => {
            try {
                const { data } = await apiClient.get('/auth/me');
                setUser(data.user);
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkUser();
    }, []);

    const logout = async () => {
        try {
            await apiClient.post('/auth/logout'); // Call the new backend route
        } catch (err) {
            console.error("Logout failed", err);
        } finally {
            setUser(null); // Clear local state regardless of server error
        }
    };
    const value = {
        user,
        setUser,
        logout, 
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);