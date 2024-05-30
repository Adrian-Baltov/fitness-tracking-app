import React, { useState, useEffect, useRef } from 'react';
import { useExercise } from '../../context';
import { useAuth } from '../../context';
import { Calendar } from 'primereact/calendar';
import styles from './ExercisePage.module.css';
import { format } from 'date-fns';

//new Date(), 'yyyy-MM-dd HH:mm:ss'

const ExercisePage = () => {
    const { calendarContainer } = styles;
    const calendarRef = useRef(null);
    const { exercises, loading, error, fetchExercises, createExercise, updateExercise, deleteExercise } = useExercise();
    const [form, setForm] = useState({ title: '', description: '', duration: '', stepsTaken: '', createdOn: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [currentExerciseId, setCurrentExerciseId] = useState(null);
    const { user } = useAuth();
    const [selectedDate, setSelectedDate] = useState(null);
    const [exercisesForSelectedDate, setExercisesForSelectedDate] = useState([]);

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
        setForm(prevForm => ({ ...prevForm, [title]: value, createdOn: format(calendarRef?.current?.getCurrentDateTime(), 'yyyy-MM-dd HH:mm:ss') }));
    };

    const handleSubmit = (e) => {
        console.error(form);
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
        setForm({
            title: exercise.title,
            description: exercise.description,
            duration: exercise.duration,
            stepsTaken: exercise.stepsTaken,
            createdOn: calendarRef?.current?.getCurrentDateTime()
        });
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
    ];

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
    };

    const renderInputLabels = (inputFieldsData) => {
        return inputFieldsData.map((inputField, index) => {
            return <div key={index}>{inputField.placeholder}</div>;
        });
    }

    const onDateSelect = (e) => {
        const selected = e.value;
        console.log(userExercises);
        setSelectedDate(selected);
        const selectedDateString = selected.toDateString();
        console.log('Selected Date:', selectedDateString);

        const exercisesForDate = userExercises.filter(ex => new Date(ex.createdOn).toDateString() === selectedDateString);
        setExercisesForSelectedDate(exercisesForDate);

        if (exercisesForDate.length === 1) {
            setForm(exercisesForDate[0]);
            setIsEditing(true);
            setCurrentExerciseId(exercisesForDate[0].id);
        } else {
            setForm({ title: '', description: '', duration: '', stepsTaken: '' });
            setIsEditing(false);
            setCurrentExerciseId(null);
        }
    };

    const dateTemplate = (date) => {
        const dateObj = new Date(date.year, date.month, date.day);
        const dateString = dateObj.toDateString();
        const exerciseDate = userExercises.find(ex => new Date(ex.createdOn).toDateString() === dateString);

        if (exerciseDate) {
            return (
                <div style={{ backgroundColor: 'green', borderRadius: '50%', color: 'white', width: '2em', height: '2em', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ color: 'white', border: '3px solid red', borderRadius: '50%', padding: '20px' }}>

                        {date.day}
                    </div>
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
                    {renderInputLabels(inputFieldsData)}
                    {renderInputFields(inputFieldsData)}
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
            {exercisesForSelectedDate.length > 0 && (
                <table className="table w-full mt-4">
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
                        {exercisesForSelectedDate.map(exercise => (
                            <tr key={exercise.id}>
                                <td>{exercise.title}</td>
                                <td>{exercise.description}</td>
                                <td>{exercise.duration} minutes</td>
                                <td>{exercise.stepsTaken}</td>
                                <td>{new Date(exercise.createdOn).toLocaleDateString()}</td>
                                <td>
                                    <button onClick={() => handleEdit(exercise)} className="btn btn-sm btn-warning mr-2">Edit</button>
                                    <button onClick={() => handleDelete(exercise.id)} className="btn btn-sm btn-error">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ExercisePage;
