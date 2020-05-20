import React, { Component } from 'react';
import {connect} from 'react-redux';

import Order from '../../components/Order/Order';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';
import Spinner from '../../components/UI/Spinner/Spinner';

class Orders extends Component {


  componentDidMount(){
    console.log('Orders.js componentDidMount');
    //VAŽNO: bio sam zbunjen kada smo postavli one uvjete u firebase za zašto samo kada kliknemo na orders link se dogoditi 'request failed with 401 status code'.
    //Prije svega treba imati na umu da firebase nije host naše stranice i da da sa axios get i post primamo i šaljemo nešto na firebase. Tako ova fn. this props.onFetchOrders()
     //aktivira fn. koja šalje requst prema firabase sa /orders.json endpointom i zato se taj error aktivira kada kliknemo na orders link jer tada ativiramo taj request prema
     //firebase. Naravno ako smo 'auth' onda sve radi i kada kliknemo orders. Znači kada samo na http://localhost:3000/ , http://localhost:3000/checkout ili 
     //http://localhost:3000/auth niti jedan event
     //ne izaziva trigger tj. request prema firebase koji je tamo definiran kao request na koji imaju pravo samo oni korisnici koji su auth.
   this.props.onFetchOrders(this.props.token, this.props.userId)
  }

   
  componentDidUpdate(){
    console.log('Orders.js componentDidUpdate');
}

    render() {
    
      let orders=<Spinner/>
      if(!this.props.loading){
        orders=(
          this.props.orders.map(order=>{
            console.log('Orders.js, order parametar unutar map',order);
            return( <Order 
             key={order.id}
             ingredients={order.ingredients}
             order={order.price}/>
            )
          }
           )
        )
      }
        return (
            <div>
                {orders}
            </div>
        );
    }
}

const mapStateToProps=state=>{
  return {
    orders: state.order.orders,
    loading: state.order.loading,
    token: state.auth.token,
    userId: state.auth.userId
  }
}

const mapDispatchToProps=dispatch=>{
  return {
    onFetchOrders: (token,userId)=>dispatch(actions.fetchOrders(token,userId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axios));