
import React, { useEffect, useState } from 'react';
import nessie from '../../../assets/nessie.jpg';
import styles from './Nessie.module.css';

const Nessie = () => {
    const [show, setShow] = useState(false);
    const phrases = [
        "You should drink more water.",
        "Keep pushing forward!",
        "Great job, keep it up!",
        "Stay positive and work hard.",
        "Every step counts!",
        "Believe in yourself.",
        "You are stronger than you think.",
        "Don't give up!",
        "Stay focused and never quit.",
        "You are doing amazing!"
    ];
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];

    useEffect(() => {
        setShow(true);
        const timer = setTimeout(() => setShow(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            className={`${styles.nessieContainer} ${show ? styles.show : ''}`}
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
            <img src={nessie} alt="Nessie" className={styles.nessieImage} />
            <div className={styles.speechBubble}>{randomPhrase}</div>
        </div>
    );
};

export default Nessie;
