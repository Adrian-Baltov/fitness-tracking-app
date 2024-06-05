import React, { useState, useEffect } from 'react';
import { useGoal } from '../../context';
import { useAuth } from '../../context';
import { format, addDays, addWeeks, addMonths } from 'date-fns';
import Toast from '../../components/toast/Toast';
import ConfirmationModal from '../../components/confirmationModal/ConfirmationModal';

const GoalsPage = () => {
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
                        type="number"
                        name="duration"
                        placeholder="Duration (minutes)"
                        value={form.duration}
                        onChange={handleInputChange}
                        required
                        className="input input-bordered w-full"
                    />
                    <select
                        name="frequency"
                        value={form.frequency}
                        onChange={handleInputChange}
                        className="select select-bordered w-full"
                    >
                        <option value="Daily">Select an option</option>
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                    </select>
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
                        <th>Duration</th>
                        <th>Frequency</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {goals.map(goal => (
                        <tr key={goal.id}>
                            <td>{goal.calories}</td>
                            <td>{goal.duration}</td>
                            <td>{goal.frequency}</td>
                            <td>
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
