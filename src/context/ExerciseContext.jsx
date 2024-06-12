import { db } from '../../firebase/firebase-config';
import { ref, get, push, update, remove } from 'firebase/database';
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext'

const ExerciseContext = createContext();

export function ExerciseProvider({ children }) {
    const { user } = useAuth();
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to fetch all exercises data 
    const fetchExercises = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const snapshot = await get(ref(db, 'exercises'));
            if (snapshot.exists()) {
                const data = snapshot.val();
                const exercisesList = Object.keys(data).map(key => ({ id: key, ...data[key] }));
                setExercises(exercisesList);
            } else {
                setExercises([]);
            }
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchExercisesByUserId = useCallback(async (userId) => {
        setLoading(true);
        setError(null);
        try {
            const snapshot = await get(ref(db, 'exercises'));
            if (snapshot.exists()) {
                const data = snapshot.val();
                const exercisesList = Object.keys(data).map(key => ({ id: key, ...data[key] }));
                const exercisesForUser = exercisesList.filter(exercise => exercise.userId === userId).reverse();
                setExercises(exercisesForUser);
            } else {
                setExercises([]);
            }
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Function to create a new exercise
    const createExercise = async (data) => {
        try {
            const exerciseRef = ref(db, 'exercises');
            const userId = user ? user.uid : null;
            const exerciseDataWithUserId = { ...data, userId };
            await push(exerciseRef, exerciseDataWithUserId);
            console.log('Exercise created successfully');
        } catch (error) {
            console.error('Failed to create exercise:', error);
        }
    };


    // Function to update existing exercise data
    const updateExercise = useCallback(async (exerciseId, data) => {
        try {
            await update(ref(db, `exercises/${exerciseId}`), data);
            console.log('Exercise updated successfully');
        } catch (error) {
            console.error('Failed to update exercise:', error);
        }
    }, []);

    // Function to delete an exercise
    const deleteExercise = useCallback(async (exerciseId) => {
        try {
            await remove(ref(db, `exercises/${exerciseId}`));
            console.log('Exercise deleted successfully');
        } catch (error) {
            console.error('Failed to delete exercise:', error);
        }
    }, []);

    // Context value containing state and functions
    const valueData = useMemo(() => ({
        exercises,
        loading,
        error,
        fetchExercises,
        createExercise,
        updateExercise,
        deleteExercise,
        fetchExercisesByUserId,
    }), [exercises, loading, error, fetchExercises, createExercise, updateExercise, deleteExercise]);

    return (
        <ExerciseContext.Provider value={valueData}>
            {children}
        </ExerciseContext.Provider>
    );
}

// Hook to use ExerciseContext
export const useExercise = () => {
    return useContext(ExerciseContext);
};
