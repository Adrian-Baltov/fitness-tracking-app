import React, { useState, useEffect } from 'react';
import { useGoal } from '../../context';
import styles from './GoalsPage.module.css';
import { useAuth } from '../../context';

const GoalsPage = () => {
    const { goals, loading, error, fetchGoals, createGoal, updateGoal, deleteGoal, fetchGoalsByUserId } = useGoal();
    const [form, setForm] = useState({ calories: '', time: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [currentGoalId, setCurrentGoalId] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchGoalsByUserId(user.uid);
        }
    }, [user, fetchGoalsByUserId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({ ...prevForm, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            updateGoal(currentGoalId, form).then(() => {
                fetchGoalsByUserId(user.uid);
                resetForm();
            }).catch(error => {
                console.error("Failed to update goal:", error);
            });
        } else {
            createGoal(form).then(() => {
                fetchGoalsByUserId(user.uid);
                resetForm();
            }).catch(error => {
                console.error("Failed to create goal:", error);
            });
        }
    };

    const handleEdit = (goal) => {
        setForm({ calories: goal.calories, time: goal.time });
        setCurrentGoalId(goal.id);
        setIsEditing(true);
    };

    const handleDelete = (goalId) => {
        deleteGoal(goalId).then(() => {
            resetForm();
        }).catch(error => {
            console.error("Failed to delete goal:", error);
        });
    };

    const resetForm = () => {
        setForm({ calories: '', time: '' });
        setIsEditing(false);
        setCurrentGoalId(null);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Goals</h2>
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="grid grid-cols-1 gap-4">
                    <input
                        type="number"
                        name="calories"
                        placeholder="Calories"
                        value={form.calories}
                        onChange={handleInputChange}
                        required
                        className="input input-bordered w-full"
                    />
                    <input
                        type="time"
                        name="time"
                        value={form.time}
                        onChange={handleInputChange}
                        required
                        className="input input-bordered w-full"
                    />
                </div>
                <div className="mt-4 flex space-x-2">
                    <button type="submit" className="btn btn-primary">{isEditing ? 'Update Goal' : 'Create Goal'}</button>
                    {isEditing && <button type="button" onClick={resetForm} className="btn btn-secondary">Cancel</button>}
                </div>
            </form>
            <table className="table w-full mt-4">
                <thead>
                    <tr>
                        <th>Calories</th>
                        <th>Time</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {goals.map(goal => (
                        <tr key={goal.id}>
                            <td>{goal.calories}</td>
                            <td>{goal.time}</td>
                            <td>
                                <button onClick={() => handleEdit(goal)} className="btn btn-sm btn-warning mr-2">Edit</button>
                                <button onClick={() => handleDelete(goal.id)} className="btn btn-sm btn-error">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GoalsPage;