import React, { useState, useEffect, useRef } from 'react';
import { useExercise, useGoal } from '../../context';
import { useAuth } from '../../context';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import Toast from '../../components/toast/Toast';
import { format } from 'date-fns';
import { ActivityRings } from "@jonasdoesthings/react-activity-rings";
import ConfirmationModal from '../../components/confirmationModal/ConfirmationModal';
import styles from './ExercisePage.module.css';

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
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);

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
                setToastMessage('Exercise updated successfully');
                setShowToast(true);
            }).catch(error => {
                console.error("Failed to update exercise:", error);
            });
        } else {
            createExercise(exerciseData).then(() => {
                fetchExercises();
                resetForm();
                setToastMessage('Exercise created successfully');
                setShowToast(true);
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
        setCurrentExerciseId(exerciseId);
        setShowModal(true);
    };

    const confirmDelete = () => {
        deleteExercise(currentExerciseId).then(() => {
            fetchExercises();
            setToastMessage('Exercise deleted successfully');
            setShowToast(true);
        }).catch(error => {
            console.error("Failed to delete exercise:", error);
        }).finally(() => {
            setShowModal(false);
            setCurrentExerciseId(null);
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
        { type: 'select', options: ["Select an option", 'Strength', 'Stamina', 'Stretching'], name: 'title', placeholder: 'Title', value: form.title, onChange: handleInputChange, required: true, className: 'w-full' },
        { type: 'text', name: 'description', placeholder: 'Description', value: form.description, onChange: handleInputChange, required: true, className: 'w-full' },
        { type: 'text', name: 'duration', placeholder: 'Duration', value: form.duration, onChange: handleInputChange, required: true, className: 'w-full' },
        { type: 'text', name: 'calories', placeholder: 'Calories', value: form.calories, onChange: handleInputChange, required: true, className: 'w-full' },
    ];

    const renderInputFields = (inputFieldsData) => {
        return inputFieldsData.map((inputField, index) => (
            <div key={index}>
                {inputField.type === 'select' ? (
                    <Dropdown
                        name={inputField.name}
                        value={inputField.value}
                        options={inputField.options.map(option => ({ label: option, value: option }))}
                        onChange={(e) => handleInputChange({ target: { name: inputField.name, value: e.value } })}
                        placeholder={inputField.placeholder}
                        className={inputField.className}
                    />
                ) : (
                    <InputText
                        name={inputField.name}
                        placeholder={inputField.placeholder}
                        value={inputField.value}
                        onChange={handleInputChange}
                        required={inputField.required}
                        className={inputField.className}
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
                        <Dropdown
                            name="goalId"
                            value={form.goalId}
                            options={goals.map(goal => ({ label: `${goal.calories} cal, ${goal.duration} min (${goal.frequency})`, value: goal.id }))}
                            onChange={(e) => handleInputChange({ target: { name: 'goalId', value: e.value } })}
                            placeholder="Select a goal"
                            className="w-full"
                        />
                    </div>
                </div>
                <div className="mt-4 flex space-x-2">
                    <Button label={isEditing ? 'Update Exercise' : 'Create Exercise'} type="submit" className="p-button-primary" />
                    {isEditing && <Button label="Cancel" type="button" onClick={resetForm} className="p-button-secondary" />}
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
            <DataTable value={exercisesForSelectedDate} showGridlines className="mt-4 p-datatable-gridlines" paginator rows={10}>
                <Column field="title" header="Name" />
                <Column field="description" header="Description" />
                <Column field="duration" header="Duration (min)" />
                <Column field="calories" header="Calories" />
                <Column field="createdOn" header="Date" body={rowData => new Date(rowData.createdOn).toLocaleDateString()} />
                <Column field="goalEndDate" header="Goal End Date" body={rowData => {
                    const goal = goals.find(goal => goal.id === rowData.goalId);
                    return goal ? new Date(goal.endDate).toLocaleDateString() : 'N/A';
                }} />
                <Column field="goalFrequency" header="Frequency" body={rowData => {
                    const goal = goals.find(goal => goal.id === rowData.goalId);
                    return goal ? goal.frequency : 'N/A';
                }} />
                <Column field="goalCalories" header="Goal Calories" body={rowData => {
                    const goal = goals.find(goal => goal.id === rowData.goalId);
                    return goal ? goal.calories : 'N/A';
                }} />
                <Column field="goalDuration" header="Goal Duration" body={rowData => {
                    const goal = goals.find(goal => goal.id === rowData.goalId);
                    return goal ? goal.duration : 'N/A';
                }} />
                <Column header="Actions" body={rowData => (
                    <>
                        <Button icon="pi pi-pencil" className="p-button-warning mr-2" onClick={() => handleEdit(rowData)} />
                        <Button icon="pi pi-trash" className="p-button-danger" onClick={() => handleDelete(rowData.id)} />
                    </>
                )} />
            </DataTable>

            {showToast && <Toast message={toastMessage} onClose={() => setShowToast(false)} />}
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
