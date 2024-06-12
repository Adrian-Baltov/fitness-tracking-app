import { db } from '../../firebase/firebase-config';
import { ref, push, update, remove, get } from "firebase/database";
import React, { createContext, useCallback, useContext, useState } from 'react';
import { useAuth } from './AuthContext'
import { fetchData } from '../utils/utils';
import { format } from 'date-fns';

const GoalContext = createContext();

export function GoalProvider({ children }) {
    const { user } = useAuth();
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


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
    const updateGoal = async (goalId, data) => {
        try {
            await update(ref(db, `goals/${goalId}`), data);
            console.log('Goal updated successfully');
        } catch (error) {
            console.error('Failed to update goal:', error);
        }
    };

    // Function to delete a goal
    const deleteGoal = async (goalId) => {
        try {
            await remove(ref(db, `goals/${goalId}`));
            console.log('Goal deleted successfully');
        } catch (error) {
            console.error('Failed to delete goal:', error);
        }
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
