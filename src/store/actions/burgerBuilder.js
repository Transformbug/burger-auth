//PAŽNJA: ovo je burgerBuilder u actions subfolderu, ima  jedan burgerBuilder i onda BurgerBuilder sa velikim početnim slovom.
import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

//btw. ovo se tzv. action creators
export const addIngredient=(name)=>{
    return {
        type: actionTypes.ADD_INGREDIENT,
        ingredientName: name
    }
}

export const removeIngredient=(name)=>{
    return {
        type: actionTypes.REMOVE_INGREDIENT,
        ingredientName: name
    }
}

//Ovo ne trebamo exportati, ali eto stavio je ovdje bezveze,služi smo da se ubaci u initIngredients...
export const setIngredients=(ingredients)=>{
    return{
        type: actionTypes.SET_INGREDIENTS,
        ingredients: ingredients
    }
}
//Također i ovo ne treba exportai jer i ovo služi samo da se ubaci doli u initIngredients...
export const fetchIngredientsFailed=()=>{
    return {
        type: actionTypes.FETCH_INGREDIENTS_FAILED
    }
}

export const initIngredients=()=>{
    return dispatch=>{
         axios.get('https://react-my-burger-47b75.firebaseio.com/ingredients.json')
        .then(response=>{
          dispatch(setIngredients(response.data))
        })
        .catch(error=>{
          dispatch(fetchIngredientsFailed())
        })
    }
}





