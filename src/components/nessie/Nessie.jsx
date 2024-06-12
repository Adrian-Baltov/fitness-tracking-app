import React, { useEffect, useState } from 'react';
import { phrases } from '../../constants/constants';
import styles from './Nessie.module.css';

const Nessie = () => {
    const [show, setShow] = useState(false);
    const [hover, setHover] = useState(false);
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
            <img src='../../../assets/nessie.png' alt="Nessie" className={styles.nessieImage} />
            <div className={styles.speechBubble}>{randomPhrase}</div>
        </div>
    );
};

export default Nessie;
