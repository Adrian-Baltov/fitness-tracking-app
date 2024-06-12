import React, { useEffect, useState } from 'react';
import { useExercise } from '../../context';
import { format, differenceInCalendarDays } from 'date-fns';

const Streak = () => {
    const { exercises } = useExercise();
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        if (exercises.length > 0) {
            calculateStreak(exercises);
        }
    }, [exercises]);

    const calculateStreak = (exercises) => {
        const sortedExercises = exercises.sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn));
        let currentStreak = 1;
        for (let i = 0; i < sortedExercises.length - 1; i++) {
            const currentDay = new Date(sortedExercises[i].createdOn);
            const previousDay = new Date(sortedExercises[i + 1].createdOn);
            const diff = differenceInCalendarDays(currentDay, previousDay);
            if (diff === 1) {
                currentStreak++;
            } else if (diff > 1) {
                break;
            }
        }
        setStreak(currentStreak);
    };

    return (
        <div className="card w-full bg-base-100 shadow-xl mb-4" style={{ backgroundColor: '#535353', boxShadow: '1px 2px 3px 1px' }}>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'row' }}>
                <h2 className="card-title">Current Workout Streak</h2>
                <p className="text-2xl">{streak} {streak === 1 ? 'day' : 'days'}</p>
            </div>
        </div>
    );
};

export default Streak;
