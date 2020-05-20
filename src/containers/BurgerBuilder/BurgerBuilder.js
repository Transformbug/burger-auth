import React, { Component } from 'react';
import {connect} from 'react-redux';

import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
//VAŽNO: pošto je ime file kojeg uvozimo index.js da samo stavili ../../store/actions import bi još funkcionirao jer bi automtakis u tom folderu actions izbarao index.js
import * as actions from '../../store/actions/index';
import axios from '../../axios-orders';

class BurgerBuilder extends Component {

    state={
            purchasing: false,
           
        }

    componentDidMount() {
        console.log('BurgerBuilder.js, componentDidMount');
        this.props.onInitIngredients()
    }   
    
    componentDidUpdate(){
        console.log('BurgerBuilder.js componentDidUpdate');
    }
   
    updatePurchaseState(ingredients) {
      
     const sum=Object.keys(ingredients)
        .map(igKey=>{
            return ingredients[igKey]
        })
        .reduce((sum,el)=>{
          return sum + el
        },0)
        return sum > 0
    }    
    
    purchaseHandler= ()=> {
        if(this.props.isAuthenticated){
          this.setState({purchasing: true})
        }else {
            //VAŽNO: ovaj onSetAuthRedirecPath ima efekt da će promjeniti u redux state vrijednost authRedirectPath na string '/checkout'
            //JAKO VAŽNO: to ne znači da u ovom trentuku idemo na /checkout već se ovaj doli this.props.history.puhs() aktivira i odemo na auth stranicu.
            //Kasnije iskoristimo ono što smo sa onSetAuthRedirectPath ovdje poslali da nakon /auth stranice odemo na /checkout
            //Znači Max je htio da dok korisnik nije logiran i počme raditi buger i klikne 'Sign up to order' i kada ga mi onda usmjerimo na /auth da onda kada se logira
            //da ga preusmjerimo na /checkout sa svim onim burger sastojcima koje je odabrao. 
            this.props.onSetAuthRedirectPath('/checkout')
            this.props.history.push('/auth')
        }
      
   }

   purchaseCancelHandler=()=>{
       this.setState({purchasing:false})
   }

   purchaseContinueHandler=()=>{
     this.props.onInitPurchase();
     this.props.history.push('/checkout')
   }

  render() {
    //   console.log('this.props.ings',this.props.ings)
    
    const disabledInfo={
        ...this.props.ings
    } 
    
    for(let key in disabledInfo){
        disabledInfo[key]=disabledInfo[key]<=0;
    }
    
    let orderSummary=null;
    
    let burger=this.props.error ?<p>Igrediends can't be loaded...</p>:<Spinner/>
    if(this.props.ings){
        burger= (
            <Aux>
             <Burger 
             //On je nastojao svugdje zamjenio this.state.ingredients sa ovim, iako mu je ostalo još, ali ni ja onda još neću maknuti sve.
            ingredients={this.props.ings}
            />
            <BuildControls
            //U komponeti BuildControls ubacujemo podatke koje trebamo kao parametar fn. onIngredinetAdded i onIngredinetRemoved
            ingredientAdded={this.props.onIngredientAdded}
            ingredientRemoved={this.props.onIngredientRemoved}
            //U inicijalnom loadu vrijednost disabled info: bude objekt gdje su ona imena sastojaka key, a boolean true bude value svako key-a. Ovo služi da se disabliaju oni botuni 'Less'
            //za one sastojke koji nisu dodani.
            disabled={disabledInfo}
            //Malo neobična sitaucija. Svaki puta kada se renda ova komponenta će se pozvati ova funkcija na ovom propu purchesable.Prije će se ta fn, aktivira nego BuildControls
            //se počme rendati.
            //Služi cijela ta funkcija da onaj botun gdje piše SIGN UP TO ORDER incijalno ne bude aktivan tj. ima onaj html atribut disablet aktivan ako zbroj vrijednost
            //sastojaka nije veće od nula.Iako se zove updatePurchaseState nigdje zapravo ne mijenjamo state.
            purchasable={this.updatePurchaseState(this.props.ings)}
            ordered={this.purchaseHandler}
            //Ovdje prebacujemo jesmo li auth komponenti BuildControls putem propa
            isAuth={this.props.isAuthenticated}
            price={this.props.price}/>
            </Aux>
            )
           
            //orderSummary je unutar if steamtenta, ali nije postvljen na burger varijablu, pazi
           orderSummary=   <OrderSummary 
            ingredients={this.props.ings}
            price={this.props.price}
            purchaseCancelled={this.purchaseCancelHandler}
            purchaseContinued={this.purchaseContinueHandler}/> 
    }
    
      return (
          <Aux>
               <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler} >
                   {orderSummary}
                  </Modal>
                  {burger}
          </Aux>
        );
    }
}

const mapStateToProps=state=>{
    return{
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !==null
    }
}

const mapDispatchToProps=dispatch=>{
    return{
        onIngredientAdded: (ingName)=>dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved: (ingName)=>dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: ()=>dispatch(actions.initIngredients()),
        onInitPurchase: ()=> dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path)=>dispatch(actions.setAuthRedirectPath(path))
    }
}
//Samo je trebalo imati nested fn.call kada im već exportamo higher order fn.
export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));