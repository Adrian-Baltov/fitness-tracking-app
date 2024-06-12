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
    const updateUser = async (username, data) => {
        try {
            await update(ref(db, `users/${username}`), data);
            console.log('User updated successfully');
        } catch (error) {
            console.error('Failed to update user:', error);
        }
    };

    // Function to delete a user
    const deleteUser = async (username) => {
        try {
            await remove(ref(db, `users/${username}`));
            console.log('User deleted successfully');
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };

    // Function to get user by username
    const getUserByName = async (username) => {
        try {
            const snapshot = await get(ref(db, `users/${username}`));
            if (snapshot.exists()) {
                return snapshot.val();
            } else {
                console.log('No data available');
                return null;
            }
        } catch (error) {
            console.error('Error getting user:', error);
            throw error;
        }
    };

    // Function to create a user 
    const createUser = (username, uid, email, firstName, lastName, phone, weight, height, role = 'basic', isBlocked = false) => {
        return set(ref(db, `users/${username}`), { username, uid, email, firstName, lastName, phone, weight, height, role, isBlocked, friends: [], createdOn: new Date() });
    };

    const getUsers = async () => {
        try {
            const snapshot = await get(ref(db, 'users'));
            if (snapshot.exists()) {
                return Object.entries(snapshot.val());
            } else {
                console.log('No data available');
                return [];
            }
        } catch (error) {
            console.error('Error getting users:', error);
            return [];
        }
    };

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
