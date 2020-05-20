import React from 'react';
import styles from './Spinner.module.css';

const Spinner = (props) => {
    console.log('Spinner.js, na vrhu');
    return (
        <div className={styles.Loader}>Loading...</div>
    );
};

export default Spinner;