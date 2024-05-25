import React, { createContext, useContext, useState } from 'react';
import { db } from '../../firebase/firebase-config';
import { ref, push, update, remove } from "firebase/database";
import { useAuth } from './AuthContext'

const GoalContext = createContext();

export function GoalProvider({ children }) {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    // Function to get goals data by UID
    const fetchGoals = async () => {
        await fetchData('goals', setLoading, setGoals, setError);
    }

    // Function to create a new goal
    const createGoal = (data) => {
        const goalRef = ref(db, 'goals');
        const userId = user ? user.uid : null;
        const goalDataWithUserId = { ...data, userId };
        return push(goalRef, goalDataWithUserId);
    };


    // Function to update existing goal data
    const updateGoal = (goalId, data) => {
        return update(ref(db, `goals/${goalId}`), data);
    };

    // Function to delete a goal
    const deleteGoal = (goalId) => {
        return remove(ref(db, `goals/${goalId}`));
    };

    // Context value containing state and functions
    const value = {
        goals,
        loading,
        error,
        fetchGoals,
        createGoal,
        updateGoal,
        deleteGoal,
    };

    return (
        <GoalContext.Provider value={value}>
            {children}
        </GoalContext.Provider>
    );
}

// Hook to use GoalContext
export const useGoal = () => {
    return useContext(GoalContext);
};
