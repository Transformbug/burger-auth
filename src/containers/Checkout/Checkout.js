import React, { Component } from 'react';
import {Route,Redirect} from 'react-router-dom';
import {connect} from 'react-redux';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';
import * as actions from '../../store/actions/index';

class Checkout extends Component {
    
    //VAŽNO: kad tamo kliknemo na cancel onda se ovo aktivira i promjeni se path u broweru,ali se ništa drugo ne aktivra i vizukano ostane sve isto. Zato sam ti zamijenio sa ovim
    //doli history.push()
    // checkoutCancelledHandler = () => { this.props.history.goBack(); }
    
    checkoutCancelledHandler = () => { this.props.history.push('/') }
    checkoutContinuedHandler = () => { this.props.history.replace('/checkout/contact-data'); }
    render () {
      let summary=<Redirect to='/'/>
      console.log('this.props.ings', this.props.ings);
      if(this.props.ings){
        const purchasedRedirect=this.props.purchased? <Redirect to='/'/>:null;
         summary=(
              <div>
                {purchasedRedirect}  
            <CheckoutSummary
            ingredients={this.props.ings}
            checkoutCancelled={this.checkoutCancelledHandler}
            checkoutContinued={this.checkoutContinuedHandler}
        />
        <Route 
        path={this.props.match.path + '/contact-data'} 
        component={ContactData}
    />
    </div>
          )
      }
         return summary;
    }
}

const mapStateToProps=state=>{
    return{
        ings: state.burgerBuilder.ingredients,
        purchased: state.order.purchased
    }
}



export default connect(mapStateToProps)(Checkout);