// src/components/nessie/Nessie.js
import React, { useEffect, useState } from 'react';
import nessie from '../../../assets/nessie.jpg';
import styles from './Nessie.module.css';

const Nessie = () => {
    const [show, setShow] = useState(false);
    const [hover, setHover] = useState(false);
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
    const [randomPhrase, setRandomPhrase] = useState(phrases[Math.floor(Math.random() * phrases.length)]);

    useEffect(() => {
        setShow(true);
        const timer = setTimeout(() => setShow(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    const handleMouseEnter = () => {
        setRandomPhrase(phrases[Math.floor(Math.random() * phrases.length)]);
        setHover(true);
    };

    const handleMouseLeave = () => {
        setHover(false);
    };

    return (
        <div
            className={`${styles.nessieContainer} ${show || hover ? styles.show : ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <img src={nessie} alt="Nessie" className={styles.nessieImage} />
            <div className={styles.speechBubble}>{randomPhrase}</div>
        </div>
    );
};

export default Nessie;