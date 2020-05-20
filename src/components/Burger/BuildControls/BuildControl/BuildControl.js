import React from 'react';
import styles from './BuildControl.module.css';

const BuildControl = (props) => {
    console.log('BuildControl.js(jednina) na vrhu');
    return (
        <div className={styles.BuildControl}>
           <div className={styles.Label}> {props.label}</div>
          <button 
           className={styles.More} 
           onClick={props.removed} 
           disabled={props.disabled}>Less</button>
           <button 
           className={styles.Less} 
           onClick={props.added} >More</button>
        </div>
    );
};

export default BuildControl;