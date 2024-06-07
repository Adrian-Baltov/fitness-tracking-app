import { ref, get, query, update } from "firebase/database";
import { db } from '../../firebase/firebase-config';



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


export const checkIfFriends = (currentUser, user) => {
    if (currentUser.friends && currentUser.friends.hasOwnProperty(user.username)) {
        return true;
    } else {
        return false;
    }
}
