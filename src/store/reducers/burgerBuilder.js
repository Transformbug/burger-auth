import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../utility';

//PAŽNJA: ovo je burgerBuilder u reducers subfolderu, ima  jedan burgerBuilder i onda BurgerBuilder sa velikim početnim slovom.
const initalState={
    ingredients: null,
    totalPrice: 4,
    error:false,
    building: false
}

const INGREDIENT_PRICES={
    salad : 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
 };

 const addIngredient=(state,action)=>{
    //VAŽNO:Ovo su computed proprties, navodno je es6. Iman screenhost objašnjenje. Uglavnom ovo je kao da smo napisali ingredients[action.ingredientName]='neka value', ali izvan objekta
        // u običnoj es5 verziji. Znači to smo ovdje napravili samo smo dodali novi property ime, ali na dinamički način gdje action.igredientName ima različite verzije, uvijek će biti 
        //drugačiji string i samim time će biti drugačije key ime.  
        const updatedIngredient={[action.ingredientName]: state.ingredients[action.ingredientName] + 1}  
        const updatedIngredients=updateObject(state.ingredients,updatedIngredient)
        const updatedState={
            ingredients: updatedIngredients,
            totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName],
            building: true
        }
        return updateObject(state, updatedState)
 }

 const removeIngredient=(state,action)=>{
    const updatedIng={[action.ingredientName]: state.ingredients[action.ingredientName] - 1}  
            const updatedIngs=updateObject(state.ingredients,updatedIng)
            const updatedSt={
                ingredients: updatedIngs,
                totalPrice: state.totalPrice - INGREDIENT_PRICES[action.ingredientName],
                building: true
            }
        return updateObject(state, updatedSt)
 }

 const setIngredients=(state,action)=>{
    //  console.log('burgerBuilder- setIngredients');
    //VAŽNO: ova funkcija se aktivira kada uvijek na početku ili kada kliknemo na Burger builder tj. kada smo na homepage tj. svaki puta kada smo re-directet na homepage.
    // Stavili smo onda incijalne sastojeke na firebase
    //na 0, ali odlučio je incijalno odmah slati request za firebase iz nekog razloga incijalno.
    //JAKO VAŽNO: ovdje mi se bila dogodila greška gdje samo slučajno builindg property stavio u ovaj objekt sa burger sastojacima umjesto skoz doli.
    //To je uzrokovalo da u onoj situciji gdje nismo logirani i dodali smo neke burger sastojke i kliklni smo na sign up to order, onda se predomislimo i kliknemo na
    //burger builder link da nas odvede opet na homepage i onda se opet vratimo na /auth tj. kliknemo na Authenticate. Onda bi se dogodilo kada bi se sad odlučili
    //logirat onda bi se dogodio problem jer bi se dogodio redirect na /checkout umjesto na homepage kao što je Max htio u componentDidMount u Auth.js komponeti.
    //Znači ključno je bilo za razumjeti da klik na burger builder u nav baru treba nas odvesti na homepage gdje ćemo ovdje restratirati building property na false koji
    //je bio true jer smo dodali neki burger sastojak. Onda onda logika u componetetDidMount u Auth.js ima smisla jer nas ono re-directa na homepage kada se ipak odličimo logirat
       //Ovo je lekcija 363. Redirecting users to the checkout page.
    

     
     return updateObject(state, {ingredients: {
        salad: action.ingredients.salad,
        bacon: action.ingredients.bacon,
        cheese: action.ingredients.cheese,
        meat: action.ingredients.meat,
        },
    totalPrice:4,
    error:false,
    building: false
})

 }

 const fetchIngredientsFailed = (state,action) => {
    return updateObject(state,{error: true})
 }

const reducer=(state=initalState, action)=>{
 switch (action.type){
     case actionTypes.ADD_INGREDIENT: return addIngredient(state,action)
     case actionTypes.REMOVE_INGREDIENT: return removeIngredient(state,action)
     case actionTypes.SET_INGREDIENTS: return setIngredients(state,action)
     case actionTypes.FETCH_INGREDIENTS_FAILED: return fetchIngredientsFailed(state,action)
     default: return state               
 }
}

export default reducer;