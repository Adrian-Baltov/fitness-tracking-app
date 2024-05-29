import React, { useState, useEffect } from 'react';
import { useExercise } from '../../context';
import { useAuth } from '../../context';
import { Calendar } from 'primereact/calendar';
import styles from './ExercisePage.module.css';

const ExercisePage = () => {
    const { calendarContainer } = styles
    const { exercises, loading, error, fetchExercises, createExercise, updateExercise, deleteExercise } = useExercise();
    const [form, setForm] = useState({ title: '', description: '', duration: '', stepsTaken: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [currentExerciseId, setCurrentExerciseId] = useState(null);
    const { user } = useAuth();
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        if (user) {
            console.log('Fetching exercises...');
            fetchExercises();
        }
    }, [user, fetchExercises]);

    useEffect(() => {
        console.log('Loading state:', loading);
        console.log('Exercises:', exercises);
        console.log('Error:', error);
    }, [loading, exercises, error]);

    const handleInputChange = (e) => {
        const { title, value } = e.target;
        setForm(prevForm => ({ ...prevForm, [title]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            updateExercise(currentExerciseId, form).then(() => {
                fetchExercises();
                resetForm();
            }).catch(error => {
                console.error("Failed to update exercise:", error);
            });
        } else {
            createExercise(form).then(() => {
                fetchExercises();
                resetForm();
            }).catch(error => {
                console.error("Failed to create exercise:", error);
            });
        }
    };

    const handleEdit = (exercise) => {
        setForm({ title: exercise.title, description: exercise.description, duration: exercise.duration, stepsTaken: exercise.stepsTaken });
        setCurrentExerciseId(exercise.id);
        setIsEditing(true);
    };

    const handleDelete = (exerciseId) => {
        deleteExercise(exerciseId).then(() => {
            fetchExercises();
        }).catch(error => {
            console.error("Failed to delete exercise:", error);
        });
    };

    const resetForm = () => {
        setForm({ title: '', description: '', duration: '', stepsTaken: '' });
        setIsEditing(false);
        setCurrentExerciseId(null);
    };

    if (!user) return <p>Loading user information...</p>;
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    if (!exercises.length) return <p>No exercises found.</p>;

    const userExercises = exercises.filter(exercise => exercise.userId === user.uid);
    const inputFieldsData = [
        { type: 'text', title: 'title', placeholder: 'Title', value: 'title', onChange: 'handleInputChange', required: true, className: 'input input-bordered w-full' },
        { type: 'text', title: 'description', placeholder: 'Description', value: 'description', onChange: 'handleInputChange', required: true, className: 'input input-bordered w-full' },
        { type: 'text', title: 'duration', placeholder: 'Duration', value: 'duration', onChange: 'handleInputChange', required: true, className: 'input input-bordered w-full' },
        { type: 'text', title: 'stepsTaken', placeholder: 'Steps Taken', value: 'stepsTaken', onChange: 'handleInputChange', required: true, className: 'input input-bordered w-full' },
    ]

    const renderInputFields = (inputFieldsData) => {
        return inputFieldsData.map((inputField, index) => {
            return <input
                key={index}
                type={inputField.type}
                title={inputField.title}
                placeholder={inputField.placeholder}
                value={form[inputField.value]}
                onChange={handleInputChange}
                required={inputField.required}
                className={inputField.className} />
        });
    }

    const onDateSelect = (e) => {
        setSelectedDate(e.value);
        const exercise = userExercises.find(ex => new Date(ex.createdOn).toDateString() === e.value.toDateString());
        if (exercise) {
            setForm(exercise);
        } else {
            setForm({ title: '', description: '', duration: '', stepsTaken: '' });
        }
        // setDialogVisible(true);
    };

    const dateTemplate = (date) => {
        const dateObj = new Date(date.year, date.month, date.day);
        const exerciseDate = exercises.find(ex => new Date(ex.createdOn).toDateString() === dateObj.toDateString());
        if (exerciseDate) {
            return (
                <div style={{ backgroundColor: 'green', borderRadius: '', color: 'white', width: '12em', height: '12em', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {date.day}
                </div>
            );
        }
        return <div>{date.day}</div>;
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Exercises</h2>
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {renderInputFields(inputFieldsData)}
                </div>
                <div className="mt-4 flex space-x-2">
                    <button type="submit" className="btn btn-primary">{isEditing ? 'Update Exercise' : 'Create Exercise'}</button>
                    {isEditing && <button type="button" onClick={resetForm} className="btn btn-secondary">Cancel</button>}
                </div>
            </form>
            <Calendar
                value={selectedDate}
                onChange={onDateSelect}
                inline
                dateTemplate={dateTemplate}
                style={{ width: '100%', border: '1px solid grey', background: 'grey' }}
                className={calendarContainer}
            >
                {
                    userExercises.map(exercise => (
                        <span
                            key={exercise.id}
                            style={{ backgroundColor: 'grey', borderRadius: '50%', padding: '0.2em' }}
                            date={new Date(exercise.createdOn).toDateString()}
                        />
                    ))
                }
            </Calendar>
            <table className="table w-full">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Duration</th>
                        <th>Steps Taken</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {userExercises.map(exercise => (
                        <tr key={exercise.id}>
                            <td>{exercise.title}</td>
                            <td>{exercise.description}</td>
                            <td>{exercise.duration} minutes</td>
                            <td>{exercise.stepsTaken}</td>
                            <td>{exercise.createdOn}</td>
                            <td>
                                <button onClick={() => handleEdit(exercise)} className="btn btn-sm btn-warning mr-2">Edit</button>
                                <button onClick={() => handleDelete(exercise.id)} className="btn btn-sm btn-error">Delete</button>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ExercisePage;
