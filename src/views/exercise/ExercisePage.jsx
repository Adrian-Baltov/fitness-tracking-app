import React, { useState, useEffect, useRef } from 'react';
import { useExercise, useGoal } from '../../context';
import { useAuth } from '../../context';
import { Calendar } from 'primereact/calendar';
import styles from './ExercisePage.module.css';
import { format } from 'date-fns';
import { ActivityRings } from "@jonasdoesthings/react-activity-rings";
import ConfirmationModal from '../../components/confirmationModal/ConfirmationModal';

const ExercisePage = () => {
    const { calendarContainer } = styles;
    const calendarRef = useRef(null);
    const { exercises, loading: exercisesLoading, error: exercisesError, fetchExercises, createExercise, updateExercise, deleteExercise, fetchExercisesByUserId } = useExercise();
    const { goals, loading: goalsLoading, error: goalsError, fetchGoalsByUserId } = useGoal();
    const [form, setForm] = useState({ title: '', description: '', duration: '', calories: '', createdOn: '', goalId: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [currentExerciseId, setCurrentExerciseId] = useState(null);
    const { user } = useAuth();
    const [selectedDate, setSelectedDate] = useState(null);
    const [exercisesForSelectedDate, setExercisesForSelectedDate] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [exerciseToDelete, setExerciseToDelete] = useState(null);

    useEffect(() => {
        if (user) {
            fetchExercisesByUserId(user.uid);
            fetchGoalsByUserId(user.uid);
        }
    }, [user, fetchExercisesByUserId, fetchGoalsByUserId]);

    useEffect(() => {
        if (calendarRef.current) {
            const currentDate = calendarRef.current.getCurrentDateTime();
            const selectedDateString = currentDate ? currentDate.toDateString() : null;
            const exercisesForDate = exercises.filter(ex => selectedDateString && new Date(ex.createdOn).toDateString() === selectedDateString);
            setExercisesForSelectedDate(exercisesForDate);
        }
    }, [exercises, selectedDate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({ ...prevForm, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const currentDateTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        const exerciseData = { ...form, createdOn: currentDateTime };

        if (isEditing) {
            updateExercise(currentExerciseId, exerciseData).then(() => {
                fetchExercises();
                resetForm();
            }).catch(error => {
                console.error("Failed to update exercise:", error);
            });
        } else {
            createExercise(exerciseData).then(() => {
                fetchExercises();
                resetForm();
            }).catch(error => {
                console.error("Failed to create exercise:", error);
            });
        }
    };

    const handleEdit = (exercise) => {
        setForm({
            title: exercise.title,
            description: exercise.description,
            duration: exercise.duration,
            calories: exercise.calories,
            createdOn: calendarRef.current?.getCurrentDateTime(),
            goalId: exercise.goalId || ''
        });
        setCurrentExerciseId(exercise.id);
        setIsEditing(true);
    };

    const handleDelete = (exerciseId) => {
        setExerciseToDelete(exerciseId);
        setShowModal(true);
    };

    const confirmDelete = () => {
        deleteExercise(exerciseToDelete).then(() => {
            fetchExercises();
        }).catch(error => {
            console.error("Failed to delete exercise:", error);
        }).finally(() => {
            setShowModal(false);
            setExerciseToDelete(null);
        });
    };

    const resetForm = () => {
        setForm({ title: '', description: '', duration: '', calories: '', goalId: '' });
        setIsEditing(false);
        setCurrentExerciseId(null);
    };

    if (!user) return <p>Loading user information...</p>;
    if (exercisesLoading || goalsLoading) return <p>Loading...</p>;
    if (exercisesError || goalsError) return <p>Error: {exercisesError?.message || goalsError?.message}</p>;

    const inputFieldsData = [
        { type: 'select', options: ["Select an option", 'Strength', 'Stamina', 'Stretching'], name: 'title', placeholder: 'Title', value: form.title, onChange: handleInputChange, required: true, className: 'input input-bordered w-full' },
        { type: 'text', name: 'description', placeholder: 'Description', value: form.description, onChange: handleInputChange, required: true, className: 'input input-bordered w-full' },
        { type: 'text', name: 'duration', placeholder: 'Duration', value: form.duration, onChange: handleInputChange, required: true, className: 'input input-bordered w-full' },
        { type: 'text', name: 'calories', placeholder: 'Calories', value: form.calories, onChange: handleInputChange, required: true, className: 'input input-bordered w-full' },
    ];

    const renderInputFields = (inputFieldsData) => {
        return inputFieldsData.map((inputField, index) => (
            <div key={index}>
                {inputField.type === 'select' ? (
                    <select name={inputField.name} onChange={inputField.onChange} className={`select select-bordered w-full ${inputField.className}`} value={inputField.value}>
                        {inputField.options.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                ) : (
                    <input
                        type={inputField.type}
                        name={inputField.name}
                        placeholder={inputField.placeholder}
                        value={inputField.value}
                        onChange={inputField.onChange}
                        required={inputField.required}
                        className={`input input-bordered w-full ${inputField.className}`}
                    />
                )}
            </div>
        ));
    };

    const renderInputLabels = (inputFieldsData) => {
        return inputFieldsData.map((inputField, index) => (
            <div key={index}>{inputField.placeholder}</div>
        ));
    };

    const onDateSelect = (e) => {
        const selected = e.value;
        setSelectedDate(selected);
    };

    const dateTemplate = (date) => {
        const dateObj = new Date(date.year, date.month, date.day);
        const dateString = dateObj.toDateString();
        const exerciseDate = exercises.find(ex => new Date(ex.createdOn).toDateString() === dateString);

        if (exerciseDate) {
            const goal = goals.find(goal => goal.id === exerciseDate.goalId);
            const caloriesProgress = goal ? Math.min((parseInt(exerciseDate.calories, 10) / parseInt(goal.calories, 10)), 100) : 0;
            const durationProgress = goal ? Math.min((parseInt(exerciseDate.duration, 10) / parseInt(goal.duration, 10)), 100) : 0;

            console.log('Exercise Date:', exerciseDate);
            console.log('Goal:', goal);
            console.log('Calories Progress:', caloriesProgress);
            console.log('Duration Progress:', durationProgress);

            return (
                <DateTemplate date={date} progress={[caloriesProgress, durationProgress]} />
            );
        }
        return <div>{date.day}</div>;
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Exercises</h2>
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {renderInputLabels(inputFieldsData)}
                    {renderInputFields(inputFieldsData)}
                    <div>
                        <select name="goalId" onChange={handleInputChange} className="select select-bordered w-full" value={form.goalId}>
                            <option value="">Select a goal</option>
                            {goals.map(goal => (
                                <option key={goal.id} value={goal.id}>{goal.calories} cal, {goal.duration} min ({goal.frequency})</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="mt-4 flex space-x-2">
                    <button type="submit" className="btn btn-primary">{isEditing ? 'Update Exercise' : 'Create Exercise'}</button>
                    {isEditing && <button type="button" onClick={resetForm} className="btn btn-secondary">Cancel</button>}
                </div>
            </form>
            <Calendar
                ref={calendarRef}
                value={selectedDate}
                onChange={onDateSelect}
                inline
                dateTemplate={dateTemplate}
                className={calendarContainer}
                style={{ width: '100%' }}
            />
            <table className="table w-full mt-4">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Duration (min)</th>
                        <th>Calories</th>
                        <th>Date</th>
                        <th>Goal End Date</th>
                        <th>Frequency</th>
                        <th>Goal Calories</th>
                        <th>Goal Duration</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {exercisesForSelectedDate.map(exercise => {
                        const goal = goals.find(goal => goal.id === exercise.goalId);
                        return (
                            <tr key={exercise.id}>
                                <td>{exercise.title}</td>
                                <td>{exercise.description}</td>
                                <td>{exercise.duration} minutes</td>
                                <td>{exercise.calories}</td>
                                <td>{new Date(exercise.createdOn).toLocaleDateString()}</td>
                                <td>{goal ? new Date(goal.endDate).toLocaleDateString() : 'N/A'}</td>
                                <td>{goal ? goal.frequency : 'N/A'}</td>
                                <td>{goal ? goal.calories : 'N/A'}</td>
                                <td>{goal ? goal.duration : 'N/A'}</td>
                                <td>
                                    <button onClick={() => handleEdit(exercise)} className="btn btn-sm btn-warning mr-2">Edit</button>
                                    <button onClick={() => handleDelete(exercise.id)} className="btn btn-sm btn-error">Delete</button>
                                </td>
                            </tr>
                        );
                    })}
                    {exercisesForSelectedDate.length === 0 && (
                        <tr>
                            <td colSpan="10">No exercises found for this date.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <ConfirmationModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={confirmDelete}
            />
        </div>
    );
};

export default ExercisePage;

const DateTemplate = ({ date, progress }) => {
    const { dateCell, circlesContainer } = styles;
    const [calories, duration] = progress;

    return (
        <div className={dateCell}>
            <div className={circlesContainer}>
                <ActivityRings
                    rings={[
                        { filledPercentage: calories, color: '#fa0e5a' },
                        { filledPercentage: duration, color: '#afff02' },
                    ]}
                    options={{
                        initialRadius: 50,
                        animationDurationMillis: 1500,
                        containerHeight: '10vh',
                        backgroundOpacity: 0.2,
                        paddingBetweenRings: 5
                    }}
                />
            </div>
            {date.day}
        </div>
    );
};
