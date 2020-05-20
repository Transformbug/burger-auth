import axios from 'axios';

import * as actionTypes from './actionTypes';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (token,userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId
    };
};

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
};


export const logout = () => {
    //Naravno, kada se odlogiramo treba maknuti ovi stvari iz local storage.
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
      //Vidi doli u authSuccess fn. objašnjenje za userId
    localStorage.removeItem('userId');
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};

//Cilj ove fn. doli je da makemo iz našeg redux state na clientu kada prođe tih sat vremena onaj token. Ionako ne vrijedi više tj. firebase neće nam dati pristup zaštićenom pathu
//te za ostatak aplikacije je bitno da zna da je token više nije u redux state. logout fn. gore je možemo reći helper fn. koju također korismo za isti cilj micanje tokena iz redux state
//u Logout.js kada korisnik klikne na link koji ima /logout.
export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
            //exparation time je u sekundama mi trebamo ms ovdje
        }, expirationTime * 1000);
    };
};

export const auth=(email, password,isSignup)=>{
    return dispatch=>{
        dispatch(authStart())
        const authData={
            email: email,
            password: password,
            returnSecureToken: true
        }
    
        //VAŽNO: ovaj authData gori točno sadrži ono što treba biti u drugom argumentu doli jer to firebase zahtjeva.
        //Vidi: https://firebase.google.com/docs/reference/rest/auth#section-create-email-password
        //VAŽNO: Malo je zbunjujuće, ali iako je ovo 'POST request' kada ovo pošaljemo, firebase nam automatski šalje response objekt sa statusom 200, ako se sve u redu ili nam
        //šalje status 400 ako je bad request. Zapravo, šta je meni, čini mi se i da kada šaljemo na jsontypicode post request da dobijemo response, tj. i kad nešto šaljemo dobijemo
        // response, samo je kada šaljemo 'get' request dobijemo response sa drugačijim sadržajem.
        //Taj response objekt koji nam firebase pošalje sadrži property config koji sadrži ono što smo mi poslali i možemo provjeriti jer taj config odgovora
        //onog kofiguraciju koju smo trebali posliait firebase za uspješan request. Također sadrži property headers,request,statusText, ali ono što je nama najvažnije
        // nalazi u property data. Tamo u data sub-objektu možemo vidjetiti onaj token koji se nalazi na idToken proprtyu, 'cryptic string' koji navondo možemo pretovirit u js objekt.
        //Taj token ćemo korisiti da dokažemo da je neki korisnik 'auth' tj. ima pristup određenim Routes na našoj aplikaciji.
        //Također u data možemo vidjeti property refreshToken koji nam služi ukoliko želimo da korisnik bude logiran duže od jednog sata. Spremimo value toga property i onda
        //to iskorismo u našem codu ako želimo produžiti taj firebase default gdje 'auth' tj. neki token vrijedni jedan sat.
        //Na proprtyu data je i taj porerty expiresIn na kojemu je vrijeme u sekundama(3600s=60min) vidimo da token vrijedi jedan sat u default slučaju.
        //Također dobijemo  property localId u data objekut koji sadržim, User UID sa firebase tj. user id. Čini mi se da je to unikatna oznaka koju dobije svaki korisinik
        //koji se sing-up za email. Također dobijemo u data objektu i property email koji sadrži naravno taj email kojim se korisnik sing-in ili sign-up. Ima još nekih
        // propertya na tome data objekut, ali nisam siguran što točno oni predstvljaju.
        //Vidi lekciju 354. Gettting token from backend i lekciju 356. Storing token.
        // VAŽNO: ovo što je iza key= desno u linku(web api key) se dobije kada se u firebase klikne na onaj kotačić i klikne se onda na 'Project settings'
        //VAŽNO: ukoliko ne spremimo token, svaki put kada se stranica refresha, refreshamo naravno i redux state pa ukoliko nismo spremli token u local storge ako je korisnik
        //bio 'auth' više neće biti nakon refresha.
      
        let url='https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBtIEtssRnACoK6EfYc692lET2-NQhkLSM'
        if (!isSignup){
            //Ovaj je url za sign-in
           url= 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBtIEtssRnACoK6EfYc692lET2-NQhkLSM'
        }
        axios.post(url,authData)
        .then(response=>{
            console.log(response);
            //VAŽNO: newDate.getTime() returna onaj broj poput npr. 1567755546703 i onda to zbrojimo sa 3600*1000(*1000 jer želimo 3600 seknudi pretvoriti u ms).To sve bude napisanao
            //unutar vanjskog newDate koji nam returna onaj objekt gdje piše nešto poput: Fri Sep 06 2019 09:33:32 GMT+0200 (Central European Summer Time).
            //VAŽNO: ono što nam piše u tom formatu bude vrijeme kada ističe vrijednost tokena tj. response.date.idToken i od kojeg vremena ga firebase više neće prihvatiti. 
           const expirationDate = new Date(new Date().getTime()+ response.data.expiresIn *1000 )
            //VAŽNO:Ovdje ubacujemo token u local storage da korisni ostane logiran ako refresha stranicu.
            //Local storage u chrome-u je u Application i konzoli tabu. klikne se na onu creticu kraj local storage da se vidi localhost file i onda se klikne na to da vidimo
            //local storage za taj file.
            localStorage.setItem('token',response.data.idToken)
            //Ovdje ubacujemo vrijeme kada nam taj gore token istječe i firebase ga više neće prihvatiti.
            //VAŽNO: taj podatak ubacujemo jer je bitno da redux state vrati token na null te tj. ostatak apliakcije mora znati ukoliko ga više ne možemo korisitit kao auth sredstvo za firebase.
            localStorage.setItem('expirationDate',expirationDate)
            //Vidi doli u authSuccess fn. objašnjenje za userId
            localStorage.setItem('userId',response.data.localId)
          dispatch(authSuccess(response.data.idToken,response.data.localId))
          dispatch(checkAuthTimeout(response.data.expiresIn))
        })
        .catch(err=>{
            console.log(err);
            dispatch(authFail(err.response.data.error))
        })
    }
}

export const setAuthRedirectPath=path=>{
    return{
        type:actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    }
}

//Ovu fn. ćemo korisiti u App.js komponeti jer želimo odmah kada se homepage loada provjeritti auth stanje i obaviti potrebne radnje.
//Znači ovdje prvo provjeravmo čime se App.js mount-a jel user ima token u local storage, ukoliko nema pozivamo logout().VAŽNO: čini mi se da je taj korak redudant-n.Vidi doli.
//Zatim u else gledamo jel slučajno istekao token, ukoliko jest također pozivamo logout.
//U nested else nakpokon ukoliko user ima token koji nije istako zovemo authSuccess da se korisnik logira.
//Sve ovo radimo da korisnik ostane logiran(ukoliko je već bio logiran) kada ručno refresha stranicu ukoliko nije isteklo vrijeme valjanosti tokena. 
export const authCheckState=()=>{
    //VAŽNO:Ovo neće biti async action creator iako returna ovu fn. sa dispatch. Jer nema ništa async ovdje. 364. leckija
    //Svaki fn. koju pozovemo u ovaj fn. dispatch, izravno returna onaj validi objekt sa {type}. Bilo izravno
    // ili poput checkAuthTimeout tako da je njezin returna poziv prema logaout() što returna taj validini action objekt sa type.
 return (dispatch,getState)=>{
   const token=localStorage.getItem('token')
   if(!token){
       //Dodao samo ovaj getState da vidim koje je stanje redux state kada se ovo pokrene tj. ovaj if aktivira. Čini mi se da je ovo redudanta tj. bespotreban korak.
       //Kada se ovaj if prođe ionako je token na null.
    //    console.log('autochekeState fn. getState()',getState());
       dispatch(logout())
   }else{
       //Ovo omotajemo u new Date jer je reurn getItema string, a želimo da ovo bude date objekt da ga možemo doli usporedit.
       const expirationDate=new Date(localStorage.getItem('expirationDate'))
       //VAŽNO: čini mi se da javascript ima automatski mehanizam za usporedbu date objekta, nekiObj<nekiDrugiObj nema nikakvog smisla. Treba to još proučit.
       //new Date() je 'now'.Znači ovaj if steatment prolazi tek kada trenutno vrijeme 'prođe' tj. bude veće(ili jednako) od expirationDate
       if(expirationDate <= new Date()){
           dispatch(logout())
       } else{
           //userId nam služi da kada pošaljemo narudžbu u ContactData na firebase i kada 'povlačimo' sve one
           // orders sa firebase u order.js koji se nalazi u actions subfolderu gdje korisiteći taj userId podatak povučemo samo orders korisnika koji je trenutno logiran
           const userId=localStorage.getItem('userId')
        dispatch(authSuccess(token,userId))
        //Ovdje dijelimo sve ovo sa 1000 jer smo ovu fn. checkoutAuthTimout postavili da očekuje sekunde i tamo množi sa 1000.
        //getTime() naravno retrune nešto poput 1567755546703 i onda to oduzmemo.
        dispatch(checkAuthTimeout((expirationDate.getTime()- new Date().getTime())/1000))
       }
      
   }
 }
}