import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import Input from '../../components/UI/Input/Input'
import Button from '../../components/UI/Button/Button'
import Spinner from '../../components/UI/Spinner/Spinner';
import styles from './Auth.module.css';
import * as actions from '../../store/actions/index';

class Auth extends Component {
    state={
        controls: {
            email:{
                elementType: 'input',
                elementConfig:{
                 type: 'email',
                 placeholder: 'Mail Address'   
                }, 
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false ,
                touched: false
              },

              password:{
                elementType: 'input',
                elementConfig:{
                 type: 'password',
                 placeholder: 'Password'   
                }, 
                value: '',
                validation: {
                    required: true,
                    minLength: 6
                },
                valid: false ,
                touched: false
              },
        },
        isSignup: true
    }

    componentDidMount(){
      //VAŽNO: vidi komentar burgerBuilder.js u reducers folderu u fn. setIngredients. Uglavnom kada kliknemo na neki sastojak, this.props.buildBurger doista bude true,
      //ali ako ponovno odemo na homepage tj. kliknemo na burger builder link onda bi this.props.buildBurger treba biti false radi logike u toj komponeti burgerBuilder.
      //Ovo je mehanizam koji je treba aktivrati ukoliko smo dodali neki sastojak klikli na 'sign up to order' i onda nas to odvede na /auth i onda ako odemo ponovno na homepage
      // tada ukoliko odemo opet na /auth i sad se odlučimo logirati onda se ovaj mehanizam aktivira jer this.props.buildingBurger bude false i this.props.authRedirectPath bude /checkout.
      //VAŽNO: znači ako smo na homepage i kliknemo na Authenicate i odemo na /auth i logiramo se zato postoji drugi mehanizam. 
      //Postoji doli u ovaj komponeti Redirect koji će nas odvesti na homepage
      //jer this.prop.isAuthenticated će biti true, a vrijednost na 'to' prop-u tj. vrijednost this.props.authRedirectPatha će biti default tj. '/'.
      //VAŽNO: taj Redirect doli također dobije vrijednost this.props.authRedirectPath '/checkout' kada kliknemo na 'sign up to order' koji nas odvede na /auth i svrha toga je da nas automtaski
      //re-directa na /checkout kada se logiramo.
      //VAŽNO: Znači i ovaj mehanizam u ovaj fn. dijeli funkcionlnost Redirecta jer ovaj onSetAuthRedirectPath() koji ovdje se pozove dok je vrijednost this.props.authRedirectPath '/checkout'
      //ima za cilj da restartira vrijednost this.props.authRedirectPath pa kada napravimo sve one akcije koje se tiču ovoga mehanizma i odlučimo se logirati što aktivira Redirect jer
      //this.props.isAutheticated bude true onda se dogodi da vrijednost this.props.authRedirect bude '/' kada se dogodi update lifecycle(koji se dogodi odmah nakon ponovnog re-mounta tj.
      // kada se re-mounta kada ponovno klikneno na Authentice i pokaže se sign-in/up form).
      //VAŽNO: kada se dogodit taj update lifecyle naravno da se neće dogodti re-direct i form se loada jer doli u Rediredct isAutheteicted je false, ali zato je spreman taj redirect kojeg mi
      // želimo na homepage kada smo se predomisli nakon što smo klikli na 'sign up to order' i otišli na homepage pa se opet vratili i onda odlučili se logirat.
      //Ovo je lekcija 363. Redirecting users to the checkout page.
      console.log('Auth.js,componentDidMount, this.props.buildingBurger',this.props.buildingBurger);
      console.log('Auth.js,componetDidMount, this.props.authREdirectPath',this.props.authRedirectPath); 
      //VAŽNO: ovaj drugi uvjet je redudantan jer kada smo dadali neki sastojeke i klikli na sign up to order onda je this.propsbuilidngBuerger true pa se ovo neće aktivirat
      // tj. neće se dogoditi overwrite /checkout na '/' authRedirectPath. Dok ukoliko je authRedirectPath već '/', ponovno stavljanje na '/' kada se ova komponeta mounta nema puno
      // smisla. Ali možda ja griješim i Max je u pravu.
      if(!this.props.buildingBurger && this.props.authRedirectPath !=='/' ){
          console.log('Auth.js unutar if u componetDidMOunt');
        this.props.onSetAuthRedirectPath()
      }
    }

    componentDidUpdate(){
        console.log('Auth.js componentDidUpdate,this.props.authRedirectPath', this.props.authRedirectPath);
    }

    checkValidity(value, rules){
        // console.log('Auth.js,chekValidity rules parmater', rules);
        let isValid=true
         if(rules.required){
            isValid=value.trim() !=='' && isValid;
        }
        if (rules.minLength){
            isValid= value.length>=rules.minLength && isValid;
        }
        if (rules.maxLength){
          isValid= value.length<=rules.maxLength && isValid;
      }
        return isValid
      }

      inputChangedHandler=(event, controlName)=>{
          const updatedControls={
              ...this.state.controls,
              [controlName]:{
                  ...this.state.controls[controlName],
                  value: event.target.value,
                  //VAŽNO: ovo ovdje je fn. call pa svaki put kad se postavi ovaj value na property valid će se pozvati ova fn. this.checkValidity
                  valid: this.checkValidity(event.target.value,this.state.controls[controlName].validation),
                  touched: true
              }
          }
          this.setState({controls: updatedControls})
      }

      submitHandler = (event) => {
          event.preventDefault()
          this.props.onAuth(this.state.controls.email.value,this.state.controls.password.value,this.state.isSignup)
      }

       switchAuthModeHandler = () => {
          this.setState(prevState=>{
              return{
                  isSignup: !prevState.isSignup
              }
          })
      }

    render() {
        const formElementsArray=[]
        for(let key in this.state.controls){
           formElementsArray.push({
               id: key,
               config: this.state.controls[key]
           })   
        }

        let form=formElementsArray.map(formElement=>{
           return( <Input 
            key={formElement.id}
            elementType={formElement.config.elementType}
            elementConfig={formElement.config.elementConfig}
            value={formElement.config.value}
            invalid={!formElement.config.valid}
            shouldValidate={formElement.config.validation}
            touched={formElement.config.touched}
            changed={(event)=>this.inputChangedHandler(event,formElement.id)}/>
            )
         })

         if(this.props.loading){
           form=<Spinner/>
         }

         let errorMassage=null

        if(this.props.error){
            errorMassage=(
                //Korismo ovaj error objekt koji dobijemo iz firebase kojeg spremimo u redux state.Taj objekt ima ovaj property .message
                <p>{this.props.error.message}</p>
            )
        }
        
        //VAŽNO:Ovo služi da kada smo signed in da nas automatski redirecta na home page tamo sa /auth page. Te više nemamo pristup ovaj stranici dok se ne odlogiramo.
        //VAŽNO: također služi i da nas usmjeri na '/checkout' sa /auth kada se logiramo nakon što smo dodali neki burger sastojak i klikli smo na 'sign up to order'
        //VAŽNO: vidi gori u componentDidMount, ima još o ovom Redirectu
        let authRedirect=null
        if(this.props.isAuthenticated){
          authRedirect=<Redirect to={this.props.authRedirectPath}/>
        }

        return (
            <div className={styles.Auth}>
                {authRedirect}
                {errorMassage}
                <form onSubmit={this.submitHandler}>
                    {form}
                <Button btnType="Success">SUBMIT</Button>
                </form>
                <Button 
                clicked={this.switchAuthModeHandler}
                btnType="Danger">Switch to {this.state.isSignup?'SIGN IN':'SIGN UP'}</Button>
            </div>
        );
    }
}

//Ovi state.auth je tu jer imao podjeljene reducere tj. korismo combineReducers()
const mapStateToProps=state=>{
    return{
        loading: state.auth.loading,
        error: state.auth.error,
        //Ovaj expressions doli rezultira sa true ako ne postoji null u redux state već je u redux state onaj string token koji dobijemo. 
        isAuthenticated: state.auth.token !==null,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath
    }
}

//VAŽNO: nebudi lud totalno. Kada napraviš novi sign up, kada ideš sign-in toga korisinika da ti vrati 200 response, a ne 400 treba naravnoi upisati password koji je naveden prilikom
//sign-up-a.U redux dev toolsu se lijepo također vidi koje se action pokreću kad sve radi i kad nije bad request.
const mapDispatchToProps=dispatch=>{
    return{
      onAuth: (email,password,isSignup)=>dispatch(actions.auth(email, password,isSignup)),
      onSetAuthRedirectPath: ()=>dispatch(actions.setAuthRedirectPath('/'))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Auth);