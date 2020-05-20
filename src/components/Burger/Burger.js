import React from 'react';
import styles from './BurgerIngredient/Burger.module.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = (props) => {

  
    console.log('Burger.js, na vrhu');
 
    
    let transformingIngredients=Object.keys(props.ingredients)
     .map(igKey=>{
       return [...Array(props.ingredients[igKey])].map((_, i)=>{
         //VAŽNO:zbunjivalo me što bude returna kad su sve vrijdnosti još 0. Map returna praznu array, ako je array koji zove map metodu nema sadržaja.
         //VAŽNO:Iskomentiraj u chrome debuaggeru .reduce nastavak lannca da vidiš return jer inače chrome debugger tvrdi da je transfromIngredineds undefined u ovom koraku.
            return <BurgerIngredient key={igKey+i} type={igKey}/>
         })

    })
   .reduce((arr, el)=>{
      return arr.concat(el);
    },[])

    //VAŽNO: vidi lekicju 158 za reduce obješnjenje.
  

   
   if(transformingIngredients.length===0){
     transformingIngredients=<p>Please start addding ingredients!</p>
   }
    
 
      return (
    
            <div className={styles.Burger}>
               <BurgerIngredient type="bread-top"/>
                  {transformingIngredients}
                <BurgerIngredient type="bread-bottom"/>
            </div>
       
    );
};

export default burger;


