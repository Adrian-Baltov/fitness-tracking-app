import React, { useState, useEffect } from 'react';
import { useExercise, useGoal, useAuth } from '../../context';
import { Container, Grid, Paper, Typography, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { format } from 'date-fns';
import Streak from '../../components/streak/Streak';
import { FaDumbbell, FaBurn, FaClock, FaRunning } from 'react-icons/fa';
import styles from './Dashboard.module.css';
import 'daisyui/dist/full.css';

const Dashboard = () => {
    const { container, box } = styles
    const { exercises, fetchExercisesByUserId } = useExercise();
    const { goals, fetchGoalsByUserId } = useGoal();
    const { user } = useAuth();
    const [totalExercises, setTotalExercises] = useState(0);
    const [totalCalories, setTotalCalories] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);
    const [averageDuration, setAverageDuration] = useState({ hours: 0, minutes: 0 });
    const [progressData, setProgressData] = useState([]);
    const [recentExercises, setRecentExercises] = useState([]);
    const [goal, setGoal] = useState(null);

    useEffect(() => {
        if (user) {
            fetchExercisesByUserId(user.uid);
            fetchGoalsByUserId(user.uid);
        }
    }, [user, fetchExercisesByUserId, fetchGoalsByUserId]);

    useEffect(() => {
        if (exercises.length > 0) {
            calculateStatistics(exercises);
            prepareProgressData(exercises);
            setRecentExercises(exercises.slice(-5).reverse());
        }
    }, [exercises]);

    useEffect(() => {
        if (goals.length > 0) {

            setGoal(goals[0]);
        }
    }, [goals]);

    const calculateStatistics = (exercises) => {
        const total = exercises.length;
        const totalCalories = exercises.reduce((sum, exercise) => {
            const calories = parseInt(exercise.calories, 10);
            return sum + (isNaN(calories) ? 0 : calories);
        }, 0);

        const totalDuration = exercises.reduce((sum, exercise) => {
            const duration = parseInt(exercise.duration, 10);
            return sum + (isNaN(duration) ? 0 : duration);
        }, 0);

        const averageDurationMinutes = total > 0 ? totalDuration / total : 0;
        const hours = Math.floor(averageDurationMinutes / 60);
        const minutes = Math.round(averageDurationMinutes % 60);

        setTotalExercises(total);
        setTotalCalories(totalCalories);
        setTotalDuration(totalDuration);
        setAverageDuration({ hours, minutes });
    };

    const prepareProgressData = (exercises) => {
        const data = exercises.map(exercise => ({
            date: format(new Date(exercise.createdOn), 'yyyy-MM-dd'),
            duration: parseInt(exercise.duration, 10) || 0,
            calories: parseInt(exercise.calories, 10) || 0
        }));
        setProgressData(data);
    };

    const renderProgressBar = (label, value, goalValue, color) => {
        let percentage = (value / goalValue) * 100;

        if (value > goalValue) {
            percentage = 100
        }

        return (
            <div className="mb-4">
                <div className="flex justify-between mb-1">
                    <span className="text-base font-medium">{label}</span>
                    <span className="text-sm font-medium">{value}/{goalValue}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div className={`h-2.5 rounded-full ${color}`} style={{ width: `${percentage}%` }}></div>
                </div>
            </div>
        );
    };

    const columns = [
        { field: 'title', headerName: 'Name', width: 150 },
        { field: 'description', headerName: 'Description', width: 300 },
        { field: 'duration', headerName: 'Duration (min)', width: 150 },
        { field: 'calories', headerName: 'Calories', width: 150 },
        {
            field: 'createdOn', headerName: 'Date', width: 150,
            renderCell: (params) => new Date(params.value).toLocaleDateString()
        }
    ];

    return (
        <Container maxWidth="lg" style={{ marginTop: '90px' }} className={container}>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>
            <Grid container spacing={3}>

                <Grid item xs={12}>
                    <Paper className={box} style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                        <FaRunning size={30} style={{ marginRight: '16px' }} />
                        <Streak />
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Paper className={box} style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FaDumbbell size={30} style={{ marginRight: '16px' }} />
                        <div>
                            <Typography variant="h6">Total Exercises</Typography>
                            <Typography variant="h4">{totalExercises}</Typography>
                        </div>
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Paper className={box} style={{ padding: '16px', display: 'flex', alignItems: 'center' }}>
                        <FaBurn size={30} style={{ marginRight: '16px' }} />
                        <div>
                            <Typography variant="h6">Total Calories Burned</Typography>
                            <Typography variant="h4">{totalCalories} kcal</Typography>
                        </div>
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Paper className={box} style={{ padding: '16px', display: 'flex', alignItems: 'center' }}>
                        <FaClock size={30} style={{ marginRight: '16px' }} />
                        <div>
                            <Typography variant="h6">Average Exercise Duration</Typography>
                            <Typography variant="h4">{averageDuration.hours} hrs {averageDuration.minutes} mins</Typography>
                        </div>
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <Paper className={box} style={{ padding: '16px' }}>
                        <Typography variant="h6" gutterBottom>Exercise Progress</Typography>
                        {goal && (
                            <div>
                                {renderProgressBar('Calories Burned', totalCalories, goal.calories, 'bg-red-500')}
                                {renderProgressBar('Exercise Duration (min)', totalDuration, goal.duration, 'bg-blue-500')}
                            </div>
                        )}
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <Paper className={box} style={{ padding: '16px' }}>
                        <Typography variant="h6">Recent Exercises</Typography>
                        <Box style={{ height: 400, width: '100%' }}>
                            <DataGrid
                                rows={recentExercises}
                                columns={columns}
                                pageSize={5}
                                rowsPerPageOptions={[5]}
                                disableSelectionOnClick
                                getRowId={(row) => row.id || row._id}
                            />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;
