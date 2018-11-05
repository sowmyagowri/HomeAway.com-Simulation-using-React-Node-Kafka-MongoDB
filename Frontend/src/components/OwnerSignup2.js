import React, {Component} from 'react';
import cookie from 'react-cookies';
import './OwnerLogin.css';
import './bootstrap-social.css';
import {Navbar} from "react-bootstrap";

import { ownersignup } from '../actions';
import { reduxForm } from "redux-form";
import { connect } from 'react-redux';
import validator from 'validator';
import SweetAlert from 'react-bootstrap-sweetalert';

//Define a Signup2 Component
class OwnerSignup2 extends Component{
    //call the constructor method
    constructor(props){
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        //maintain the state required for this component
        this.state = {
            firstname: { value: '', isValid: true, message: '' },
            lastname: { value: '', isValid: true, message: '' },
            email: { value: '', isValid: true, message: '' },
            password: { value: '', isValid: true, message: '' },
            message: "",
            alert: null,
        }
        //Bind the handlers to this class
        this.changeHandler = this.changeHandler.bind(this);
        this.handleValidation = this.handleValidation.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
    }

    //firstname ,lastname, email and password change handler to update state variable with the text entered by the user
    changeHandler = (e) => {
        const state = {
          ...this.state,
          [e.target.name]: {
            ...this.state[e.target.name],
            value: e.target.value,
            isValid: true,
            message: '',
          }
        };

        this.setState(state);
    }

    handleValidation(){
        let formIsValid = true;
        const firstname = { ...this.state.firstname };
        const lastname = { ...this.state.lastname };
        const email = { ...this.state.email };
        const password = { ...this.state.password };

        //Firstname
        if(!firstname.value){
            formIsValid = false;
            firstname.message = "First Name is a Required field";
            firstname.isValid = false;
            console.log("First Name cannot be empty");
        } else if(typeof firstname.value !== "undefined"){
            if(!firstname.value.match(/^[a-zA-Z ]+$/)){
                formIsValid = false;
                firstname.message = "First Name cannot contain numbers";
                firstname.isValid = false;
                console.log("First Name cannot contain numbers");
            }        
        }

        //Lastname
        if(!lastname.value){
            formIsValid = false;
            lastname.message = "Last Name is a Required field";
            lastname.isValid = false;
            console.log("Last Name cannot be empty");
         } else if(typeof lastname.value !== "undefined"){
            if(!lastname.value.match(/^[a-zA-Z ]+$/)){
                formIsValid = false;
                lastname.message = "Last Name cannot contain numbers";
                lastname.isValid = false;
                console.log("Last Name cannot contain numbers");
            }        
        }
        
        //Email
        if(!email.value){
            formIsValid = false;
            email.message = "Email Address is a Required field";
            email.isValid = false;
        }
        if(typeof email.value !== "undefined"){
            if (!validator.isEmail(email.value)) {
                formIsValid = false;
                email.message = "Email Address is invalid";
                email.isValid = false;
                console.log("Email ID is not Valid");
            }
        }

        //Password
        if(!password.value){
            formIsValid = false;
            password.message = "Password is a required field";
            password.isValid = false;
            console.log("Password cannot be empty");
        }

        if (!formIsValid) {
            this.setState({
                firstname,
                lastname,
                email,
                password
            });
        }

        return formIsValid;
   }

   //submit Login handler to send a request to the node backend
    submitLogin(event) {
        console.log("Inside owner submit login");
        //prevent page from refresh
        event.preventDefault();
        if(this.handleValidation()){
            const data = {
                firstname : this.state.firstname.value,
                lastname : this.state.lastname.value,
                email : this.state.email.value,
                password : this.state.password.value
            }
            
            this.props.ownersignup(data).then(response => {

                if(response.payload.status === 200){

                    //store JWT Token to browser session storage 
                    //If you use localStorage instead of sessionStorage, then this will persist across tabs and new windows.
                    //sessionStorage = persisted only in current tab
                    sessionStorage.setItem('jwtToken', response.payload.data.token);
                    sessionStorage.setItem('cookie1', response.payload.data.cookie1);
                    sessionStorage.setItem('cookie2', response.payload.data.cookie2);
                    sessionStorage.setItem('cookie3', response.payload.data.cookie3);
                    sessionStorage.setItem('cookie4', response.payload.data.cookie4);
                    
                    const getAlert = () => (
                        <SweetAlert 
                        success 
                        title = "Success!!"
                        onConfirm={() => window.location = "/owner/propertypost"}>
                        Owner profile created!
                        </SweetAlert>
                    );

                    this.setState({
                        message: "",
                        alert: getAlert(),
                    });
                } else if(response.payload.status === 201){
                    //sessionStorage = persisted only in current tab
                    sessionStorage.setItem('jwtToken', response.payload.data.token);
                    sessionStorage.setItem('cookie1', response.payload.data.cookie1);
                    sessionStorage.setItem('cookie2', response.payload.data.cookie2);
                    sessionStorage.setItem('cookie3', response.payload.data.cookie3);
                    sessionStorage.setItem('cookie4', response.payload.data.cookie4);
                    const getAlert = () => (
                        <SweetAlert 
                        success 
                        title = "Success!!"
                        onConfirm={() => window.location = "/owner/propertypost"}>
                        Owner profile has been added to Traveler login! You can now use the same login details
                        </SweetAlert>
                    );
              
                    this.setState({
                        alert: getAlert(),
                    });
                }
            }).catch (error => {
                console.log("Error is", error);
                this.setState({
                    message: JSON.parse(error.response.request.response).responseMessage,
                });
            });
        }
    }

    render(){

        const { firstname, lastname, email, password, message } = {...this.state};
        //redirect based on successful login
        let redirectVar = null;
        console.log("Cookie is", sessionStorage.getItem('cookie1'))

        return(
            <div>
                {redirectVar}
                <Navbar>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a href="/" title = "HomeAway" className = "logo"><img src={require('./homeaway_logo.png')} alt="Homeaway Logo"/></a>
                        </Navbar.Brand> 
                        <div className="col-sm-12 col-sm-offset-12" style={{left: "595px", fontSize: "15px"}}>
                        {message &&
                            <div className={`alert alert-danger`}>{message}</div>
                        }
                        </div>
                    </Navbar.Header>
                    <img src={require('./logo.png')} alt="Homeaway Logo"/>
                </Navbar>  
                <div className="container">
                <p></p>
                </div>
                <div className="container">
                <p></p>
                </div>
                <div className="container">
                <p></p>
                </div>
                <div className="container">
                <p></p>
                </div>
                <div className="container">
                <p></p>
                </div>
                <div className="container">
                <p></p>
                </div>
                <div className="center">
                    <div id="yourdiv">
                        <h1 className="display-5">Sign Up for HomeAway<br></br></h1>
                        <h2><small>	Already have an Owner account? <a className="bg-default" href="/owner/login">Log in</a></small></h2>
                    </div>
                </div>
                <div className="container">
                <div className="col-sm-6" style={{width: "35%", left: "350px"}}>
                        <div className="login-form">
                            <br></br>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className={'form-group' + (!firstname.value ? ' has-error' : !firstname.isValid)}>
                                        <input onChange = {this.changeHandler} type="text" className="form-control" name="firstname" value={firstname.value} placeholder="First Name"/>
                                        <div className="help-block">{firstname.message}</div>
                                    
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className={'form-group' + (!lastname.value ? ' has-error' : !lastname.isValid)}>
                                        <input onChange = {this.changeHandler} type="text" className="form-control" name="lastname" value={lastname.value} placeholder="Last Name"/>
                                        <div className="help-block">{lastname.message}</div>
                                    </div>
                                </div>
                            </div>
                            <div className={'form-group' + (!email.value ? ' has-error' : !email.isValid)}>
                                <input onChange = {this.changeHandler} type="email" className="form-control" name="email" value={email.value} placeholder="Email Address"/>
                                <div className="help-block">{email.message}</div>
                            </div>
                            <div className={'form-group' + (!password.value ? ' has-error' : !password.isValid)}>
                                <input onChange = {this.changeHandler} type="password" className="form-control" name="password" value={password.value} placeholder="Password"/>
                                <div className="help-block">{password.message}</div>
                            </div>
                            <div>
                                <button onClick = {this.submitLogin} className="btn btn-warning" style={{width:"100%"}}>Sign me Up</button>
                                {this.state.alert}
                            </div>
                        </div>
                        <div className="mydiv"><span className="myspan">or</span></div>
                        <br></br>
                        <div>
                            <button className="mybtn facebook_button">Log in with Facebook</button>
                        </div>
                        <br></br>
                        <div>
                            <button className="mybtn google_button" >Log in with Google</button>
                        </div>
                        <br></br>
                        <div className="center" id= "yourdiv">
                            <font size="1">We don't post anything without your permission.
                            <br></br>
                            By creating an account you are accepting our Terms and Conditions and Privacy Policy.
                            <br></br>
                            </font>
                        </div>
                        <br></br>
                        </div>
                </div>
                <br></br>
                <div className="center" id= "yourdiv">
                <font size="1">Use of this Web site constitutes acceptance of the HomeAway.com Terms and Conditions and Privacy Policy.
                <br></br>
                ©2018 HomeAway. All rights reserved.</font>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return { ownersignup: state.ownersignup };
}

//export Signup2 Component
export default reduxForm({
    form: "OwnerSignUpForm"
  })(connect(mapStateToProps, {ownersignup}) (OwnerSignup2) );