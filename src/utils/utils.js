import { ref, get, query } from "firebase/database";
import { db } from '../../firebase/firebase-config';

export const fetchData = async (table, setLoading, setData, setError) => {
    setLoading(true);
    const exercisesQuery = query(ref(db, table));

    try {
        const snapshot = await get(exercisesQuery);
        if (snapshot.exists()) {
            const flattenData = Object.entries(snapshot.val()).map(([key, value]) => ({
                id: key,
                ...value
            }));
            setData(flattenData);
        } else {
            setData([]);
        }
    } catch (error) {
        setError(error);
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