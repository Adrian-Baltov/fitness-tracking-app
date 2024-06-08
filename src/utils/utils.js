import { ref, get, query, update } from "firebase/database";
import { db } from '../../firebase/firebase-config';
import { useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useState } from "react";





export const fetchData = async (collectionName, setLoading, setData, setError) => {
    setLoading(true);
    setError(null);
    try {
        const snapshot = await get(ref(db, collectionName));
        if (snapshot.exists()) {
            const data = snapshot.val();
            const dataList = Object.keys(data).map(key => ({ id: key, ...data[key] }));
            setData(dataList);
        } else {
            setData([]);
        }
    } catch (err) {
        setError(err);
    } finally {
        setLoading(false);
    }
};

export const getAllUsersArray = async () => {
    const usersRef = ref(db, 'users');
    const usersSnapshot = await get(usersRef);

    if (usersSnapshot.exists()) {


        const usersArray = Object.entries(usersSnapshot.val()).map(([key, value]) => ({

            ...value
        }));
        return usersArray;
    } else {
        return [];
    }

};

export const searchAllUsers = async (search = '') => {
    try {
        const usersArray = await getAllUsersArray();
        if (usersArray) {
            if (search) {
                const filteredUsers = usersArray.filter(user => user.username && user.username.toLowerCase().includes(search.toLowerCase()));
                return filteredUsers;
            } else {
                return [];
            }

        }

    } catch (error) {
        console.log('Errro searching users: ', error);
    }
};


export const deleteUserFromDifferentRefs = async (refPATH, username) => {
    try {
        const refference = ref(db, refPATH);
        update(refference, {
            [username]: null
        });
    } catch (error) {
        console.log('Error deleting user from ref: ', error);
    }
};





export const checkIfFriends = (currUserFriendsObj, user) => {

    if (currUserFriendsObj && currUserFriendsObj.hasOwnProperty(user.username)) {
        return true;
    } else {
        return false;
    }



}
/*
  Custom hook to handle accepting friend requests
*/
export const useHandleAccept = () => {

    const { userData, getUserByName, updateUser } = useUser();
    const handleAccept = async (from, setFromUserData, fromUserData) => {
        const notificationsRef = `users/${userData.username}/notifications`;
        const friendRequestsRef = `users/${userData.username}/friendRequests`;
        const sentRequestsRef = `users/${from}/sentRequests`;
        await deleteUserFromDifferentRefs(notificationsRef, from);
        await deleteUserFromDifferentRefs(friendRequestsRef, from);
        await deleteUserFromDifferentRefs(sentRequestsRef, userData.username);
        await deleteUserFromDifferentRefs(friendRequestsRef, userData.username);


        const currUserUsername = userData.username;
        getUserByName(from)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    setFromUserData(data);
                }

            })
            .catch((error) => {
                console.log('Error getting user data: ', error);
            });


        const fromUserFriends = fromUserData?.friends ? { ...fromUserData.friends, [currUserUsername]: true } : { [currUserUsername]: true };
        const currentUserFriends = userData?.friends ? { ...userData.friends, [from]: true } : { [from]: true };
        updateUser(currUserUsername, { friends: currentUserFriends });
        updateUser(from, { friends: fromUserFriends });
    }
    return handleAccept;

}
