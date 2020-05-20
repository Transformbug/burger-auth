import React,{Component} from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Auxiliary/Auxiliary';

const withErrorHandler = (WrappedComponent, axios) => {
   
    //Pazi,ovo je anonimna class componet koju returna withErrorHandler
    return class extends Component{

        state={
            error: null
        }

        componentDidMount(){
            console.log('withError.js componentDidMount');
        }
        
         componentDidUpdate(){
             console.log('withError.js componentDidUpdate');
         }
      
         //VAŽNO: bitno je primjetiti da se inicijalno postave ovako axios.interceptors na this.reqInterceptor prije nego što se aktivra axsios.get tako da se u BurgerBuilder u componetDidMount
         //aktivira this.props.onInitIngredients() tj. prije bilo koje axsios requesta.
     constructor() {
        super()
        //Ovdje se dogodi ona situacije gdje bude setState re-render prije returna ovdje jer je cijla ova callback fn. također async. vidi moja vježba u redux foldru,tamo sam testirao
        //btw. to nema veze sa redux-om, tamo mi je bilo najjednostvnije...
         this.reqInterceptor=axios.interceptors.request.use((req)=>{
            // console.log('ovo je unutar .request inerceptora');
             this.setState({error: null})
             return req
         })
        
       //VAŽNO: bio sam zbunjen zašto se ne aktivra i ovaj .response ovdje.Aktivra se on samo ako je napisan kao u originalu doli onda se u chrome debuggeru slabo primjeti,
       //Ovaj this,setState je u error tj. catch fn. nije unutar ove glavne res funkcije i zato se ne aktivra u inicijalnom loadu.
       this.resInterceptor=axios.interceptors.response.use(res=>{
            // console.log('ovo je unutar .response interceptora');
            return res
         }, error=>{
            this.setState({error: error})
            })
         
    //      this.resInterceptor=axios.interceptors.response.use(res=>res, error=>{
    //         this.setState({error: error})
    //         })
     
 }
     
     componentWillUnmount() {
     
       axios.interceptors.request.eject(this.reqInterceptor)
       axios.interceptors.response.eject(this.reqInterceptor)
     }
     
     errorConfirmedHandler=()=>{
        this.setState({error: null})
     }

        render() {
            return (
                <Aux>
                    <Modal 
                      show={this.state.error}
                      //Ovo služi kad se pojavi ona error poruka da je maknemo, tj. da potvrdimo da smo vidjeli to porku o erroru.
                      modalClosed={this.errorConfirmedHandler}
                      >
                         {this.state.error? this.state.error.message: null}
                        </Modal>
                <WrappedComponent {...this.props}/>
                </Aux>
            )
        }
     
    }
};

export default withErrorHandler;