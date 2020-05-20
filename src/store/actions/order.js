import * as actionTypes from './actionTypes';
import axios  from '../../axios-orders';

export const purchaseBurgerSuccess=(id,orderData)=>{
    return {
        type: actionTypes.PURCHASE_BURGER_SUCCESS,
        orderId: id,
        orderData: orderData
    }
}

export const purchaseBurgerFail=(error)=>{
    return{
        type: actionTypes.PURCHASE_BURGER_FAIL,
        error: error
    }
}

export const purchaseBurgerStart=()=>{
    return{
        type: actionTypes.PURCHASE_BURGER_START
    }
}

export const purchaseBurger=(orderData,token)=>{
    return dispatch=>{
        //Zanimljivo: koristimo ovaj paramtar tj. fn. dispatch tri puta kao fn. call. ovdje.
        
        dispatch(purchaseBurgerStart())
        //VAŽNO: vidi doli objašnjenje ovoga tokena.
        console.log(token);
        console.log(orderData);
        axios.post('/orders.json?auth='+ token, orderData)
    .then(response=>{
        // console.log('***********PruchaseBurger-response**************',response);
        dispatch(purchaseBurgerSuccess(response.data.name,orderData))  
     
    })
    .catch(error=>{
      dispatch(purchaseBurgerFail(error))
   }
        )
    }
}

export const purchaseInit=()=>{
    return{
        type: actionTypes.PURCHASE_INIT
    }
}

export const fetchOrdersSuccess=(orders)=>{
   return{
       type: actionTypes.FETCH_ORDERS_SUCCESS,
       orders: orders
   }
}


export const fetchOrdersFail=(error)=>{
    return{
        type: actionTypes.FETCH_ORDERS_FAIL,
        error: error
    }
 }

 export const fetchOrdersStart=()=>{
    return{
        type: actionTypes.FETCH_ORDERS_START,
    }
 }

 export const fetchOrders=(token,userId)=>{
     return dispatch=>{
         dispatch(fetchOrdersStart())
         //VAŽNO:Vrijednost ovoga token prametara je null incijalno jer je to redux state, kada dobijemo token od firebas onda bude onaj token string.
         //btw. to je i onaj uvjet u firbase u database kada odemo na rules. .read i .write je dozvoljeno na /orders endpoinut tj. node ako auth=!null, a definirali smo ovdje da je
         // auth incijalno null. Također ovaj doli string + null bude doista string kada additon opertora obavi svoju opraciju.
         //VAŽNO:Kao što vidimo taj token string kojeg primimo treba poslati kao vrijednost auth query parmetra da bi dobili pristup tome zaštićenom route koji treba taj token.
         //VAŽNO: vidi lekciju 359. Accessing protected routes kako prilagodit firebase za protected i unproteced routes.
         //VAŽNO: kad je nastao ovaj komentar onda je to ovako izgledalo.
        // axios.get('/orders.json?auth='+ token)
         
        //VAŽNO: bitno je za firebase da ove vrijdnosit queryparmetara budu u double quotes.
        //VAŽNO: https://firebase.google.com/docs/reference/rest/database/#section-query-parameters na tom linku je se može naći orderBy,znači to je definiranu u firebase.
        //https://firebase.google.com/docs/database/rest/retrieve-data#section-rest-ordered-data
        //VAŽNO: da bi ove parametri userId i qualtTo radili morali smo još u rules dodati  ".indexOn": ["userId"]
        //VAŽNO: vidi lekciju 368 Displying user specific orders, btw. ja sam stavio ovaj template string umjeso onog njegovog rješenja, dođe na isto.
         
        //VAŽNO: u prijašnjoj verziji ovdje bi 'povukli' sve orders sa firebase. Sa ovim posebnim paramterima orderBy i sa equalTo govorimo firebase da hoćemo smo order
        //od jednnog koristina tj. trenutno logiranog korisnika. Prije bi se prikazalo sve orders koje se na firebase, sada vidimo i što je bitno povlačimo samo
        //order to logiranog korisnika(mogli smo povući sve orders i onda raditit na client side usporedbu, ali radi sigurnosit je bolje da ovaj korisniku u javascriput dobije
        //samo svoje orders of servera tj. firebasea) 
        axios.get(`/orders.json?auth=${token}&orderBy="userId"&equalTo="${userId}"`)
        .then(res=> {
            console.log(res.data);
            const fetchedOrders=[]
            for(let key in res.data){
              fetchedOrders.push({...res.data[key],id: key})
            }
         dispatch(fetchOrdersSuccess(fetchedOrders))
        })
        .catch(err=>{
          dispatch(fetchOrdersFail(err))  
        }
       )
     }
 }
