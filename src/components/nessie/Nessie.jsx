import React, { useEffect, useState } from 'react';
import nessie from '../../../assets/nessie.jpg';
import styles from './Nessie.module.css';

const Nessie = () => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(true);
        const timer = setTimeout(() => setShow(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`${styles.nessieContainer} ${show ? styles.show : ''}`}>
            <img src={nessie} alt="Nessie" className={styles.nessieImage} />
            <div className={styles.speechBubble}>You should drink more water</div>
        </div>
    );
};

export default Nessie;
