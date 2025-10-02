//Auth context
import {createContext, useContext, useEffect, useState} from 'react';
import apiClient from '../api'

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({children}) {
    const [user, setUser] = useState(null);
    const [checking, setChecking] = useState(true);
    useEffect (() => {
        apiClient.get('/auth/me').then(r => setUser(r.data.user)).catch(() =>{})
        .finally(() => setChecking(false));
    }, [])

    return (
        <AuthContext.Provider value={{user, setUser, checking}}>
            {children}
        </AuthContext.Provider>
    );
}