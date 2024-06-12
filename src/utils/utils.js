import { ref, get, query, update, remove } from "firebase/database";
import { db } from '../../firebase/firebase-config';
import { useState } from "react";
import { useEffect } from "react";
import { useUser } from "../context/UserContext";


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


/**
 * Function to get all users
 * 
 * @returns {Promise} - array of all users
 */

export const getAllUsersArray = async () => {
    try {
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
    } catch (error) {
        console.log('Error getting all users: ', error);
    }


};

/**
 * Function to search all users
 * 
 * @param {string} search - search query 
 * @returns  {Promise} - array of users that match the search query
 */
export const searchAllUsers = async (search = '') => {
    try {
        const usersArray = await getAllUsersArray();
        if (usersArray) {
            if (search) {
                const filteredUsers = usersArray.filter(user => user.username && user.username.toLowerCase().includes(search.toLowerCase()));
                return filteredUsers;
            } else {
                return usersArray;
            }

        } else {
            return [];
        }

    } catch (error) {
        console.log('Errro searching users: ', error);
    }
};


/**
 * Function to search friends
 * 
 * @param {string} search 
 * @param {Array} friends 
 * @returns {Promise} - array of friends that match the search query
 */
export const searchFriends = async (search = '', friends) => {
    try {
        if (friends) {
            if (search) {
                const filteredFriends = friends.filter(friend => friend.toLowerCase().includes(search.toLowerCase()));

                return filteredFriends;
            } else {
                return friends;
            }
        } else {
            return [];
        }
    } catch (error) {
        console.log('Error searching friends: ', error);
    }
}

/**
 *  Function to delete user from different references
 * 
 * @param {string} refPATH - path to the reference 
 * @param {string} username - username of the user to delete 
 */
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


/**
 * Custom hook to handle sending friend requests
 * 
 * @param {Object} currUserFriendsObj 
 * @param {Object} user 
 * @returns  {boolean} - true if the user is already a friend, false if not
 */
export const checkIfFriends = (currUserFriendsObj, user) => {

    if (currUserFriendsObj && currUserFriendsObj.hasOwnProperty(user.username)) {
        return true;
    } else {
        return false;
    }

}
/**
 * Custom hook to handle accepting friend requests
 * 
 * @returns {function} handleAccept - function to handle accepting friend requests
 */
export const useHandleAccept = () => {

    const { userData, getUserByName, updateUser } = useUser();
    const handleAccept = async (from) => {
        try {
            const notificationsRef = `users/${userData?.username}/notifications`;
            const friendRequestsRef = `users/${userData?.username}/friendRequests`;
            const sentRequestsRef = `users/${from}/sentRequests`;
            await deleteUserFromDifferentRefs(notificationsRef, from);
            await deleteUserFromDifferentRefs(friendRequestsRef, from);
            await deleteUserFromDifferentRefs(sentRequestsRef, userData.username);


            const currUserUsername = userData.username;
            const snapshot = await getUserByName(from)
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.val();

                        return data;
                    }

                })
                .catch((error) => {
                    console.log('Error getting user data: ', error);
                });


            const fromUserFriends = snapshot.friends ? { ...snapshot.friends, [currUserUsername]: true } : { [currUserUsername]: true };
            const currentUserFriends = userData?.friends ? { ...userData.friends, [from]: true } : { [from]: true };


            updateUser(currUserUsername, { friends: currentUserFriends });
            updateUser(from, { friends: fromUserFriends });
        } catch (error) {
            console.log('Error accepting friend request: ', error)
        }

    }
    return handleAccept;

}


/**
 * Custom hook to handle declining friend requests
 * 
 * @param {string} from - username of the user who sent the friend request
 * @returns {function} handleDecline - function to handle declining friend requests
 */
export const useHandleDecline = () => {
    const { userData } = useUser();
    const handleDecline = async (from) => {
        try {
            const notificationsRef = `users/${userData?.username}/notifications`;
            const friendRequestsRef = `users/${userData?.username}/friendRequests`;
            const sentRequestsRef = `users/${from}/sentRequests`;
            await deleteUserFromDifferentRefs(notificationsRef, from);
            await deleteUserFromDifferentRefs(friendRequestsRef, from);
            await deleteUserFromDifferentRefs(sentRequestsRef, userData.username);
            await deleteUserFromDifferentRefs(friendRequestsRef, userData.username);
        } catch (error) {
            console.log('Error declining friend request: ', error)
        }

    }
    return handleDecline;
}

export const blockAccount = async (username) => {
    return await update(ref(db, '/users/' + username), {
        isBlocked: true
    });
}

export const unblockAccount = async (username) => {
    return await update(ref(db, '/users/' + username), {
        isBlocked: false,
    });
}

export const deleteAccount = async (username) => {

    try {
        await remove(ref(db, '/users/' + username));
    } catch (error) {
        console.error("Error deleting user: ", error);
    }
}