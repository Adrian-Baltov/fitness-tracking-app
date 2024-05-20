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