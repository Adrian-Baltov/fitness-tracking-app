import React, { useState, useEffect } from 'react';
import { useGoal } from '../../context';
import { useAuth } from '../../context';
import { format, addDays, addWeeks, addMonths } from 'date-fns';
import Toast from '../../components/toast/Toast';
import ConfirmationModal from '../../components/confirmationModal/ConfirmationModal';
import styles from './GoalsPage.module.css';

const GoalsPage = () => {
    const { container } = styles;
    const { goals, loading, error, fetchGoals, createGoal, updateGoal, deleteGoal, fetchGoalsByUserId } = useGoal();
    const [form, setForm] = useState({ calories: '', duration: '', frequency: 'Daily' });
    const [isEditing, setIsEditing] = useState(false);
    const [currentGoalId, setCurrentGoalId] = useState(null);
    const { user } = useAuth();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [goalToDelete, setGoalToDelete] = useState(null);

    useEffect(() => {
        if (user) {
            fetchGoalsByUserId(user.uid);
        }
    }, [user, fetchGoalsByUserId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({ ...prevForm, [name]: value }));
    };

    const calculateEndDate = (frequency, createdOn) => {
        const createdDate = new Date(createdOn);
        let endDate;
        switch (frequency) {
            case 'Daily':
                endDate = addDays(createdDate, 1);
                break;
            case 'Weekly':
                endDate = addWeeks(createdDate, 1);
                break;
            case 'Monthly':
                endDate = addMonths(createdDate, 1);
                break;
            default:
                endDate = createdDate;
        }
        return format(endDate, 'yyyy-MM-dd HH:mm:ss');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const createdOn = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        const endDate = calculateEndDate(form.frequency, createdOn);
        const goalData = { ...form, createdOn, endDate };

        if (isEditing) {
            updateGoal(currentGoalId, goalData).then(() => {
                fetchGoalsByUserId(user.uid);
                resetForm();
                setToastMessage('Goal updated successfully');
                setShowToast(true);
            }).catch(error => {
                console.error("Failed to update goal:", error);
            });
        } else {
            createGoal(goalData).then(() => {
                fetchGoalsByUserId(user.uid);
                resetForm();
                setToastMessage('Goal created successfully');
                setShowToast(true);
            }).catch(error => {
                console.error("Failed to create goal:", error);
            });
        }
    };

    const handleEdit = (goal) => {
        setForm({ calories: goal.calories, duration: goal.duration, frequency: goal.frequency });
        setCurrentGoalId(goal.id);
        setIsEditing(true);
    };

    const handleDelete = (goalId) => {
        setGoalToDelete(goalId);
        setShowModal(true);
    };

    const confirmDelete = () => {
        deleteGoal(goalToDelete).then(() => {
            fetchGoalsByUserId(user.uid);
            setShowToast(true);
            setToastMessage('Goal deleted successfully');
        }).catch(error => {
            console.error("Failed to delete goal:", error);
        }).finally(() => {
            setShowModal(false);
            setGoalToDelete(null);
        });
    };

    const resetForm = () => {
        setForm({ calories: '', duration: '', frequency: 'Daily' });
        setIsEditing(false);
        setCurrentGoalId(null);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className={container}>
            <h1 className="text-3xl font-bold mb-6">Goals</h1>
            <form onSubmit={handleSubmit} className="mb-6 p-6 shadow-md rounded-lg" style={{ background: 'rgba(104, 104, 104, 0.8)' }}>
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label style={{ color: 'white' }} className="block text-sm font-medium mb-1" htmlFor="calories">Calories</label>
                        <input
                            type="number"
                            name="calories"
                            id="calories"
                            placeholder="Calories"
                            value={form.calories}
                            onChange={handleInputChange}
                            required
                            className="input input-bordered w-full"
                        />
                    </div>
                    <div>
                        <label style={{ color: 'white' }} className="block text-sm font-medium mb-1" htmlFor="duration">Duration (minutes)</label>
                        <input
                            type="number"
                            name="duration"
                            id="duration"
                            placeholder="Duration (minutes)"
                            value={form.duration}
                            onChange={handleInputChange}
                            required
                            className="input input-bordered w-full"
                        />
                    </div>
                    <div>
                        <label style={{ color: 'white' }} className="block text-sm font-medium mb-1" htmlFor="frequency">Frequency</label>
                        <select
                            name="frequency"
                            id="frequency"
                            value={form.frequency}
                            onChange={handleInputChange}
                            className="select select-bordered w-full"
                        >
                            <option value="">Select an option</option>
                            <option value="Daily">Daily</option>
                            <option value="Weekly">Weekly</option>
                            <option value="Monthly">Monthly</option>
                        </select>
                    </div>
                </div>
                <div className="mt-6 flex space-x-2">
                    <button type="submit" className="btn btn-primary">{isEditing ? 'Update Goal' : 'Create Goal'}</button>
                    {isEditing && <button type="button" onClick={resetForm} className="btn btn-secondary">Cancel</button>}
                </div>
            </form>
            <table className="table w-full mt-4">
                <thead className="">
                    <tr>
                        <th className="px-4 py-2">Calories</th>
                        <th className="px-4 py-2">Duration</th>
                        <th className="px-4 py-2">Frequency</th>
                        <th className="px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {goals.map(goal => (
                        <tr key={goal.id}>
                            <td className="px-4 py-2">{goal.calories}</td>
                            <td className="px-4 py-2">{goal.duration}</td>
                            <td className="px-4 py-2">{goal.frequency}</td>
                            <td className="px-4 py-2">
                                <button onClick={() => handleEdit(goal)} className="btn btn-sm btn-warning mr-2">Edit</button>
                                <button onClick={() => handleDelete(goal.id)} className="btn btn-sm btn-error">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showToast && <Toast message={toastMessage} onClose={() => setShowToast(false)} />}
            <ConfirmationModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={confirmDelete}
            />
        </div>
    );
};

export default GoalsPage;
