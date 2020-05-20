import React from 'react';
import styles from './NavigationItem.module.css';
import {NavLink} from 'react-router-dom';


const NavigationItem = (props) => {
    console.log('NavigationItem.js, na vrhu')
    return (
        <li className={styles.NavigationItem}>
            <NavLink 
            //Ovo mi je bilo služilo da zaustvi kad kliknem na orders chrome debugger,ali to je bespotrebno samo sam trebao kliknuti na ona pause i onda kad kliknem će se
            //chrome debugger zaustaviti iako ovo nije onClick event, kad makem ovaj onClick naravno
            // onClick={()=>'bezveze'}
            to={props.link}
            exact={props.exact} 
            activeClassName={styles.active}>  {props.children} </NavLink>
            </li>
    );
};

export default NavigationItem;