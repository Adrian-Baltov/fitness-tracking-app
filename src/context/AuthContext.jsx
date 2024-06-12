import { auth } from '../../firebase/firebase-config'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { createContext, useContext, useEffect, useState } from "react";


const AuthContext = createContext(null);

export const AuthProvder = ({ children }) => {
    const [user, loading, error] = useAuthState(auth);

    const register = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    }

    const logout = () => {
        return signOut(auth);
    }

    const valueData = {
        user,
        loading,
        error,
        register,
        login,
        logout
    }

    return <AuthContext.Provider value={valueData}>
        {!loading && children}
    </AuthContext.Provider>
}

export const useAuth = () => {
    return useContext(AuthContext);
}

// to use the context const { user, loading, error, register, login, logout } = useAuth();
