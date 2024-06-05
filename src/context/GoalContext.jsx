import React, { createContext, useCallback, useContext, useState } from 'react';
import { db } from '../../firebase/firebase-config';
import { ref, push, update, remove, get } from "firebase/database";
import { useAuth } from './AuthContext'
import { format } from 'date-fns';
import { fetchData } from '../utils/utils';

const GoalContext = createContext();

export function GoalProvider({ children }) {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    // Function to get goals data by UID
    const fetchGoals = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const snapshot = await get(ref(db, 'goals'));
            if (snapshot.exists()) {
                const data = snapshot.val();
                const goalsList = Object.keys(data).map(key => ({ id: key, ...data[key] }));
                setGoals(goalsList);
            } else {
                setGoals([]);
            }
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchGoalsByUserId = useCallback(async (userId) => {
        setLoading(true);
        setError(null);
        try {
            const snapshot = await get(ref(db, 'goals'));
            if (snapshot.exists()) {
                const data = snapshot.val();
                const goalsList = Object.keys(data).map(key => ({ id: key, ...data[key] }));
                const goalsForUser = goalsList.filter(goal => goal.userId === userId);
                setGoals(goalsForUser);
            } else {
                setGoals([]);
            }
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Function to create a new goal
    const createGoal = (data) => {
        const goalRef = ref(db, 'goals');
        console.error(data);
        const userId = user ? user.uid : null;
        const goalDataWithUserId = { ...data, userId, createdOn: format(new Date(), 'yyyy-MM-dd HH:mm:ss') };
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
        fetchGoalsByUserId
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
