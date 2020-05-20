import React from 'react';
import styles from './Order.module.css';

const Order = (props) => {
   
    const ingredients=[];

    for (let ingredientName in props.ingredients){
        ingredients.push(
            {
                name: ingredientName,
                 amount: props.ingredients[ingredientName]
                })
    }

    const ingredientOutput=ingredients.map(ig=>{
        return <span 
        style={{
         textTransform: 'capitalize',
         display:'inline-block',
         margin: '0 8px',
         border: '1px solid #ccc',
         padding: '5px'
        }}
        key={ig.name}>{ig.name}({ig.amount})</span>
    })
         console.log('Order.js, props.price', props.price);
    return (
        <div className={styles.Order}>
            <p>Ingredients: {ingredientOutput}</p>
              {/* PAŽNJA: ovdje je bila greška jer sam stavio props.price, ali pošto je Max kombinriao stare i nove videa,
              možda je greška nastala jer je props.order zapisan u starijoj verziji. Trentuno radi dok je props.order */}
            <p>Price:<strong>USD:{Number.parseFloat(props.order).toFixed(2)}</strong></p>
        </div>
    );
};

export default Order;