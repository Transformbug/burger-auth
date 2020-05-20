import React from 'react';
import styles from './NavigationItems.module.css';
import NavigationItem from './NavigationItem/NavigationItem';


const NavigationItems = (props) => { 
  
     console.log('NavigationItems.js, na vrhu')
    return (
       <ul className={styles.NavigationItems}>
     {/* Ovo ovdje je samo obično prop prebacivanje, naravno, value ovoga exact propa je true.Ovo nije route    */}
           <NavigationItem link="/" exact >Burger builder </NavigationItem>

          {/*Svrha ovoga je da ne vidimo u nav baru Order link dok nismo authenticated */} 
           {props.isAuthenticated? <NavigationItem  link="/orders"> Orders </NavigationItem>:null}
        
         {/*Layout je class based komponeta što znači da connect od redux-a tj. redux funkcionra sa njom. U njoj dobijmo podatak o redux auth state i onda children te komponte
        putem svojim prop-va pošalju taj podatak ovdje u Navigation Item. 
        VAŽNO: Onda ovdje ovisno o tome je li !props.isAutheticated prikazujemo NavgationItem na kojem piše Atuhetica ili Logaout i naravno vodi na različiti path */}
         {!props.isAuthenticated ? 
           <NavigationItem link="/auth"> Authenticate </NavigationItem>
           :<NavigationItem link="/logout"> Logout </NavigationItem>}
       </ul>
    );
};

export default NavigationItems;