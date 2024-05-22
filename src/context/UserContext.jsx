import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../../firebase/firebase-config';
import { ref, set, update, remove, get, query, orderByChild, equalTo } from "firebase/database";
import { useAuth } from './AuthContext';

const UserContext = createContext();

export function UserProvider({ children }) {
    const { user } = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to get user data by UID
    const getUserData = async (uid) => {
        const userQuery = query(ref(db, 'users'), orderByChild('uid'), equalTo(uid));
        const snapshot = await get(userQuery);

        if (snapshot.exists()) {
            const data = Object.values(snapshot.val())[0];

            return data;
        }
        return null;
    };

    // Effect to fetch user data when the user changes
    useEffect(() => {
        if (user) {
            getUserData(user.uid).then((data) => {
                setUserData(data);
                setLoading(false);
              
            }).catch((error) => {
                setError(error);
                setLoading(false);
            });
        } else {
            setLoading(false);
        }

    }, [user]);


    // Function to update existing user data
    const updateUser = (username, data) => {
        return update(ref(db, `users/${username}`), data);
    };

    // Function to delete a user
    const deleteUser = (username) => {
        return remove(ref(db, `users/${username}`));
    };

    // Function to get user by username
    const getUserByName = (username) => {
        return get(ref(db, `users/${username}`));
    };

    // Function to create a user 
    const createUser = (username, uid, email, firstName, lastName, phone, role = 'basic', isBlocked = false, ) => {
        return set(ref(db, `users/${username}`), { username, uid, email, firstName, lastName, phone, role, isBlocked, friends: [], createdOn: new Date() });
    };

    const getUsers = async () => {
        const snapshot = await get(ref(db, 'users'));
        return Object.entries(snapshot.val());
    }

    // Context value containing state and functions
    const valueData = {
        userData,
        loading,
        error,
        createUser,
        updateUser,
        deleteUser,
        getUserByName,
        getUsers
    };

    return (
        <UserContext.Provider value={valueData}>
            {children}
        </UserContext.Provider>
    );
}

// Hook to use UserContext
export const useUser = () => {
    return useContext(UserContext);
}
