import React, { createContext, useContext, useState } from 'react';
import { db } from '../../firebase/firebase-config';
import { ref, update, remove, get, query, push } from "firebase/database";
import { fetchData } from '../utils/utils';

const ExerciseContext = createContext();

export function ExerciseProvider({ children }) {
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to fetch all exercises data 
    const fetchExercises = async () => {
        console.log('fetching exercises');
        await fetchData('exercises', setLoading, setExercises, setError);

    }

    // Function to create a new exercise
    const createExercise = (data) => {
        const exerciseRef = ref(db, 'exercises');

        return push(exerciseRef, data);
    };

    // Function to update existing exercise data
    const updateExercise = (exerciseId, data) => {
        return update(ref(db, `exercises/${exerciseId}`), data);
    };

    // Function to delete an exercise
    const deleteExercise = (exerciseId) => {
        return remove(ref(db, `exercises/${exerciseId}`));
    };

    // Context value containing state and functions
    const valueData = {
        exercises,
        loading,
        error,
        fetchExercises,
        createExercise,
        updateExercise,
        deleteExercise,
    };

    return (
        <ExerciseContext.Provider value={valueData}>
            {children}
        </ExerciseContext.Provider>
    );
}

// Hook to use ExerciseContext
export const useExercise = () => {
    return useContext(ExerciseContext);
}
