import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from '../../../store/actions/index';

//VAŽNO: Cijla poanta ove komponete je da kada kliknemo na logout, da kada se ovo "loada", u navodnike jer ova komponeta nema vizualni sadržaj da nas automtomaski redirecta na home page. 

class Logout extends Component {

  
    


    componentDidMount () {
        console.log('Logout.js componentDidMount');
        //Ova fn. koju pokrećremo this.props.logout ima za cilj da resetria redux state tj. da izbriše token kada kliknemo na logout,userId također.
        this.props.onLogout();
    }

    
    componentDidUpdate(){
        console.log('Logout.js componentDidUpdate');
    }

    render () {
        return <Redirect to="/"/>;
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onLogout: () => dispatch(actions.logout())
    };
};

export default connect(null, mapDispatchToProps)(Logout);