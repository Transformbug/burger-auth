import React, { Component } from 'react';
import {Route,Switch,withRouter,Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Checkout from './containers/Checkout/Checkout';
import Orders from './containers/Orders/Orders';
import Auth from './containers/Auth/Auth';
import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions/index';

class App extends Component {
  
  componentDidMount(){
    console.log('App.js componentDidMount');
     this.props.onTryAutoSignup()
  }

  componentDidUpdate() {
    console.log('App.js, componeentDidUpdate');
  }
  
 
 render() {
   //VAŽNO:Podjelli smo ove Routers iako su neke Routes već bile nedostupne korisnicima u UI na ovaj način jer smo htjeli osigurati da korisnik nema pristup nekim Routes ako nije
   // logiran na način da upiše doslovno path u browser.
   //VAŽNO: Redirect ovaj služi da kada pišemo u browser http://localhost:3000/orders da ne dobijemo praznu stranicu nego da nas automaski preusmjeri na homepage.
   //VAŽNO: ali stvarno ne razumjemo ovaj Redirect i kako se on aktivira kad odemo na  http://localhost:3000/orders.
   let routes=(
    <Switch>
    <Route path="/auth" component={Auth}/>
    <Route path="/" exact component={BurgerBuilder}/>
    <Redirect to='/'/>
    </Switch>
   )
 //Također je i ovaj Redirect služi da nas usmjeri na homepage ako neki path nije poznat.
 //JAKO VAŽNO: kad unutar <Route/> ne postavimo path prop onda će se komponeta loadati kad je aktivan bilo koji path. Izgleda da ovaj <Redirect/> radi na sličom principu
 //i da će nas usmjeriti na ono što navedmmo kao vrijednost u 'to' propu kada smo na bilo kojem pathu ako nismo naveli 'from' prop. 
 //VAŽNO: zato jer je <Redirect to='/'> unutar Switch-a i zato jer je na zadnjem mjestu ne odvede nas na homepage ako je path recimo /logout, ali će nas odvesti na homepage
 //ako se aktivira bilo koji path koji nije naveden ovdje unutar Switcha.
   if(this.props.isAuthenticated){
    routes=( <Switch>
     <Route path="/checkout" component={Checkout}/>
     <Route path="/orders" component={Orders}/>
     {/*Incijalno ovo nije stavio ovdje, ali ako ne loadamo komponeti Auth gdje je onaj redirect kada smo authenticated onda nas nikad redirect u Auth komponeti na može odvesti
    na /checkout kada smo logirani tj. čim se logiramo. Sada ako netko želi i dok je logiran može otiću na /auth stranicu ako izravno upiše path u browser jer smo dodali ovo ovdje,
    ali ionako tamo ne može ništa napravit. Naravno postoje i nekad druga rješenja, ali on je ovo ostavio ovako
     VAŽNO: btw. lekcija 372 Fixing the redirect to front page je zadnja lekcija u ovom folderu burger-auth iako je to već prešlo u section 19 improving our burger project.
     Ostatak te sekcija je refactoring i neću ga code along nego će uzesti gotovo code koji ću korisiti i u idućoj Testing sekciji.
     Evenutalno je lazy loading značjni dodatak, ali to je sve jasno.
     VAŽNO: znači ostala je ona glupost i kod njega u finaloj verzija da kada otvorimo onaj izbornik u mobilnoj verzijijt tj. u malom viewportu da moramo kliknuit 
     na backdrop sastrane i nema botna za zatvorit te je ostalo onaj način da kada samo na /checkout da kada kliknemo continue da se samo 
     ispod pojavi onaj input field, ne ode se na novu stranicu*/}
     <Route path="/auth" component={Auth}/>
     <Route path="/logout" component={Logout}/>
     <Route path="/" exact component={BurgerBuilder}/>
     {/* <Redirect to='/'/> */}
     </Switch>
    )

   }
    return (
      <div>
        <Layout>
         {routes}
        </Layout>
      </div>
    );
  }
}

const mapStateToPros=state=>{
  return{
    isAuthenticated: state.auth.token!==null
}
}

const mapDispatchToProps=dispatch=>{
  return{
   onTryAutoSignup: ()=> dispatch(actions.authCheckState())
  }
}
//VAŽNO: 365 lekcija. Uopće mi nije jasno ovo, meni nije bio error tj. mogao sam otići na Authetication stranicu dok nisam imao ovaj withRouter omotač.
//Uglavnom netko mi treba objesniti cijelu tu situaciju sa withRouter-om i redux-om tj. connectom.
export default withRouter(connect(mapStateToPros,mapDispatchToProps)(App));

// export default connect(mapStateToPros,mapDispatchToProps)(App)