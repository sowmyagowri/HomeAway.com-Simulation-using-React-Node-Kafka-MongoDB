import React, {Component} from 'react';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import './Profile.css';
import {Navbar} from "react-bootstrap";

import { profilefetch, profilesave } from '../actions';
import { reduxForm } from "redux-form";
import { connect } from 'react-redux';

//Define a Login Component
class Profile extends Component{
    //call the constructor method
    constructor(props){
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = { 
            profiledata : [], 
            year : "" , 
            firstnameisValid: true, 
            firstnameMessage: "" , 
            lastnameisValid: true, 
            lastnameMessage: "",
            message: ""
        };

        //Bind the handlers to this class
        this.firstnameChangeHandler = this.firstnameChangeHandler.bind(this);
        this.lastnameChangeHandler = this.lastnameChangeHandler.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.handleValidation = this.handleValidation.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
    }

    logout = () => {
        cookie.remove('cookie1', {path: '/'})
        cookie.remove('cookie2', {path: '/'})
        cookie.remove('cookie3', {path: '/'})
        console.log("All cookies removed!")
        window.location = "/"
    }

    componentWillMount(){
        console.log("will mount");
        if(cookie.load('cookie1')){
            var input_email = cookie.load('cookie2');
            console.log(input_email);
            const data = { email : input_email }
            this.props.profilefetch(data, sessionStorage.getItem('jwtToken')).then(response => {
                if(response.payload.status === 200){
                    this.setState({ profiledata: response.payload.data });
                    this.refs.createdyear.value = this.state.profiledata.created;
                    this.state.firstname = this.state.profiledata.firstname;
                    this.refs.firstname.value = this.state.profiledata.firstname;
                    this.state.lastname = this.state.profiledata.lastname;
                    this.refs.lastname.value = this.state.profiledata.lastname;
                    this.state.aboutMe = this.state.profiledata.aboutMe;
                    this.refs.aboutMe.value = this.state.profiledata.aboutMe;
                    this.state.city = this.state.profiledata.city;
                    this.refs.city.value = this.state.profiledata.city;
                    this.state.state = this.state.profiledata.state;
                    this.refs.state.value = this.state.profiledata.state;
                    this.state.country = this.state.profiledata.country;
                    this.refs.country.value = this.state.profiledata.country;
                    this.state.company = this.state.profiledata.company;
                    this.refs.company.value = this.state.profiledata.company;
                    this.state.school = this.state.profiledata.school;
                    this.refs.school.value = this.state.profiledata.school;
                    this.state.hometown = this.state.profiledata.hometown;
                    this.refs.hometown.value = this.state.profiledata.hometown;
                    this.state.gender = this.state.profiledata.gender;
                    this.refs.gender.value = this.state.profiledata.gender;
                    this.state.phone = this.state.profiledata.phone;
                    this.refs.phone.value = this.state.profiledata.phone;
                    this.state.languages = this.state.profiledata.languages;
                    this.refs.languages.value = this.state.profiledata.languages;
                }
            })
            .catch(err => {
                console.log(err);
                alert("Cannot fetch details");
            });
        }
    }

    firstnameChangeHandler = (e) => {
        this.setState({ 
            firstname: e.target.value,
            firstnameisValid: true, 
            firstnameMessage: "" , 
         });   
    }

    lastnameChangeHandler = (e) => {
        this.setState({ 
            lastname: e.target.value,
            lastnameisValid: true, 
            lastnameMessage: "" , 
         });   
    }

    changeHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    //change handler to update state variable with the text entered by the user
    changeHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleValidation(){
        let formIsValid = true;

        //Firstname
        if(!this.state.firstname){
            formIsValid = false;
            this.setState({
                firstnameMessage: "First Name is a Required field",
                firstnameisValid: false,
            });
            console.log("First Name cannot be empty");
        } else if(typeof this.state.firstname !== "undefined"){
            if(!this.state.firstname.match(/^[a-zA-Z ]+$/)){
                formIsValid = false;
                this.setState({
                    firstnameMessage: "First Name cannot contain numbers",
                    firstnameisValid: false,
                })
                console.log("First Name cannot contain numbers");
            }        
        }

        //Lastname
        if(!this.state.lastname){
            formIsValid = false;
            this.setState({
                lastnameMessage: "Last Name is a Required field",
                lastnameisValid: false,
            });
            console.log("Last Name cannot be empty");
         } else if(typeof this.state.lastname !== "undefined"){
            if(!this.state.lastname.match(/^[a-zA-Z ]+$/)){
                formIsValid = false;
                this.setState({
                    firstnameMessage: "Last Name cannot contain numbers",
                    firstnameisValid: false,
                })
                console.log("Last Name cannot contain numbers");
            }        
        }

        return formIsValid;
   }

    //submit Login handler to send a request to the node backend
    saveChanges(event) {
        console.log("Inside save form");
        //prevent page from refresh
        event.preventDefault();
        if(this.handleValidation()){
            console.log("Profile Form data submitted");
            var input_email = cookie.load('cookie2');
            console.log(input_email);
            const data = {
                firstname : this.state.firstname,
                lastname : this.state.lastname,
                aboutMe : this.state.aboutMe,
                city : this.state.city,
                state : this.state.state,
                country : this.state.country,
                company : this.state.company,
                school : this.state.school,
                hometown : this.state.hometown,
                gender : this.state.gender,
                phone : this.state.phone,
                languages : this.state.languages,
                email : input_email,
            }
            
            console.log(data);
            this.props.profilesave(data, sessionStorage.getItem('jwtToken')).then(response => {
                console.log("Status Code : ", response.payload.status);
                if(response.payload.status === 200){
                    this.setState({
                        profiledata: response.payload.data,
                        message: "Profile Data succesfully saved!"
                    });
                }
            }) 
            .catch (error => {
                console.log("Error is:", error);
            });
        }
    }

    render(){

        //redirect based on successful login
        let redirectVar = null;
        console.log(cookie.load('cookie1'))
        if(!cookie.load('cookie1')){
            redirectVar = <Redirect to= "/"/>
        }
        return(
            <div>
                {redirectVar}
                <Navbar inverse collapseOnSelect>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a href="/" title = "HomeAway" className = "logo"><img src={require('./homeaway_logo.png')} alt="Homeaway Logo"/></a>
                        </Navbar.Brand> 
                        <div className="col-sm-12 col-sm-offset-8" style={{ marginBottom: "-2rem", left: "400px", fontSize: "18px"}}>
                        {this.state.message &&
                            <div className={`alert alert-success`}>{this.state.message}</div>
                        }
                        </div>
                    </Navbar.Header>
                    <div>
                        {(cookie.load('cookie1') === 'travellercookie') 
                        ?
                        (
                        <div className="btn btn-group" id="white">
                            <button className="dropdown-toggle"  style = {{fontSize: "18px", backgroundColor:"transparent", background:"transparent", borderColor:"transparent"}} type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Hello {cookie.load('cookie3')}</button>
                            <div className="dropdown-menu">
                                <a className="dropdown-item" href="#"> <i class="fas fa-envelope"></i> Inbox</a>
                                <a className="dropdown-item" href="/traveller/mytrips"> <i class="fas fa-briefcase"></i> My Trips</a>
                                <a className="dropdown-item" href="/Profile"> <i class="fas fa-user"></i> My Profile</a>
                                <a className="dropdown-item" href="#" onClick= {this.logout}> <i class="fas fa-sign-out-alt"></i> Logout</a>
                            </div>
                        </div>
                        )
                        :
                        (
                        <div className="btn btn-group" id="white">
                            <button className="dropdown-toggle"  style = {{fontSize: "18px", backgroundColor:"transparent", background:"transparent", borderColor:"transparent"}} type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Hello {cookie.load('cookie3')}</button>
                            <div className="dropdown-menu">
                                <a className="dropdown-item" href="#"> <i class="fas fa-envelope"></i> Inbox</a>
                                <a className="dropdown-item" href="/owner/mylistings"> <i class="fas fa-home"></i> My Listings</a>
                                <a className="dropdown-item" href="/owner/propertypost"> <i class="fas fa-building"></i> Post Property</a>
                                <a className="dropdown-item" href="/Profile"> <i class="fas fa-user"></i> My Profile</a>
                                <a className="dropdown-item" onClick = {this.logout}> <i class="fas fa-sign-out-alt"></i> Logout</a>
                            </div>
                        </div>
                        )
                    }
                    <img style={{marginLeft: "50px"}} src={require('./logo.png')} alt="Homeaway Logo"/>
                    </div>
                </Navbar>
                <div className="container">
                </div>
                <div style={{backgroundColor: "white", borderLeftColor:"white",borderRightColor:"white",borderBottomColor: "#d6d7da", borderTopColor: "#d6d7da", borderStyle: "solid"}}>
                {(cookie.load('cookie1') === 'travellercookie') 
                ?
                (
                    <div id="conttab" class="container">
                        <ul id="ulinktab">
                            <li id="ulinktab" class="one"><a id="linktab" href="#"> <i class="fas fa-envelope"></i> Inbox</a></li>
                            <li id="ulinktab" class="two"><a id="linktab" href="/traveller/mytrips"> <i class="fas fa-briefcase"></i> My Trips</a></li>
                            <li id="ulinktab" class="three"><a id="linktab" href="/Profile"> <i class="fas fa-user"></i> My Profile</a></li>
                            <hr id="hrtab" />
                        </ul>
                    </div>
                )
                :
                (
                    <div id="conttab" class="container">
                        <ul id="ulinktab">
                            <li id="ulinktab" class="one"><a id="linktab" href="#"> <i class="fas fa-envelope"></i> Inbox</a></li>
                            <li id="ulinktab" class="two"><a id="linktab" href="/owner/mylistings"> <i class="fas fa-home"></i> My Listings</a></li>
                            <li id="ulinktab" class="three"><a id="linktab" href="/Profile"> <i class="fas fa-user"></i> My Profile</a></li>
                            <li id="ulinktab" class="four"><a id="linktab" href="/owner/propertypost"> <i class="fas fa-building"></i> Post Property</a></li>
                            <hr id="hrtab" />
                        </ul>
                    </div>
                )
                }
                </div>
                <div className="image "></div>
                <div id = "profilehref" className="myprofilecontainer">
                    <div className="login-form">
                        <h1>{cookie.load('cookie3')}</h1>
                        <h2><small>Member since  <input id = "year" ref = "createdyear" type="text" readOnly="readonly" /> </small></h2>
                        <h1><small>Profile Information</small></h1>
                        <br></br>
                        <div className={'form-group' + (!this.state.firstname ? ' has-error' : !this.state.firstnameisValid)}>
                            <input ref = "firstname" onChange = {this.firstnameChangeHandler} type="text" className="form-control" name="firstname" value={this.state.firstname} placeholder="First Name"/>
                            <div className="help-block">{this.state.firstnameMessage}</div>
                        </div>
                        <div className={'form-group' + (!this.state.lastname ? ' has-error' : !this.state.lastnameisValid)}>
                            <input ref = "lastname" onChange = {this.lastnameChangeHandler} type="text" className="form-control" name="lastname" value={this.state.lastname} placeholder="Last Name"/>
                            <div className="help-block">{this.state.lastnameMessage}</div>
                        </div>
                        <div className="form-group">
                            <textarea ref = "aboutMe" style={{height : "100px", cols:"40", rows: "5", }} onChange = {this.changeHandler} type="text" className="form-control input-lg" name="aboutMe" value={this.state.aboutMe} placeholder="About me"/>
                        </div>
                        <div className="form-group">
                            <input ref = "city" onChange = {this.changeHandler} type="text" className="form-control" name="city" value={this.state.city} placeholder="City"/>
                        </div>
                        <div className="form-group">
                            <select style={{width:"100%"}} ref = "state" onChange={this.changeHandler} value={this.state.state} name="state">
                                <option style={{color: "#ccc",}} value="" hidden>State</option>
                                <option value="Alabama">Alabama</option>
                                <option value="Alaska">Alaska</option>
                                <option value="Arizona">Arizona</option>
                                <option value="Arkansas">Arkansas</option>
                                <option value="California">California</option>
                                <option value="Colorado">Colorado</option>
                                <option value="Connecticut">Connecticut</option>
                                <option value="Delaware">Delaware</option>
                                <option value="District of Columbia">District of Columbia</option>
                                <option value="Florida">Florida</option>
                                <option value="Georgia">Georgia</option>
                                <option value="Guam">Guam</option>
                                <option value="Hawaii">Hawaii</option>
                                <option value="Idaho">Idaho</option>
                                <option value="Illinois">Illinois</option>
                                <option value="Indiana">Indiana</option>
                                <option value="Iowa">Iowa</option>
                                <option value="Kansas">Kansas</option>
                                <option value="Kentucky">Kentucky</option>
                                <option value="Louisiana">Louisiana</option>
                                <option value="Maine">Maine</option>
                                <option value="Maryland">Maryland</option>
                                <option value="Massachusetts">Massachusetts</option>
                                <option value="Michigan">Michigan</option>
                                <option value="Minnesota">Minnesota</option>
                                <option value="Mississippi">Mississippi</option>
                                <option value="Missouri">Missouri</option>
                                <option value="Montana">Montana</option>
                                <option value="Nebraska">Nebraska</option>
                                <option value="Nevada">Nevada</option>
                                <option value="New Hampshire">New Hampshire</option>
                                <option value="New Jersey">New Jersey</option>
                                <option value="New Mexico">New Mexico</option>
                                <option value="New York">New York</option>
                                <option value="North Carolina">North Carolina</option>
                                <option value="North Dakota">North Dakota</option>
                                <option value="Northern Marianas Islands">Northern Marianas Islands</option>
                                <option value="Ohio">Ohio</option><option value="Oklahoma">Oklahoma</option>
                                <option value="Oregon">Oregon</option>
                                <option value="Pennsylvania">Pennsylvania</option>
                                <option value="Puerto Rico">Puerto Rico</option>
                                <option value="Rhode Island">Rhode Island</option>
                                <option value="South Carolina">South Carolina</option>
                                <option value="South Dakota">South Dakota</option>
                                <option value="Tennessee">Tennessee</option>
                                <option value="Texas">Texas</option>
                                <option value="Utah">Utah</option>
                                <option value="Vermont">Vermont</option>
                                <option value="Virginia">Virginia</option>
                                <option value="Virgin Islands">Virgin Islands</option>
                                <option value="Washington">Washington</option>
                                <option value="West Virginia">West Virginia</option>
                                <option value="Wisconsin">Wisconsin</option>
                                <option value="Wyoming">Wyoming</option>
                            </select><br/>
                            </div>
                            <div className="form-group">
                                <input onChange = {this.changeHandler} ref = "country" value={this.state.country} type="text" className="form-control" name="country" placeholder="Country"/>
                            </div>
                            <div className="form-group">
                                <input onChange = {this.changeHandler} ref = "company" value={this.state.company} type="text" className="form-control" name="company" placeholder="Company"/>
                            </div>
                            <div className="form-group">
                                <input onChange = {this.changeHandler} ref = "school" value={this.state.school} type="text" className="form-control" name="school" placeholder="School"/>
                            </div>
                            <div className="form-group">
                                <input onChange = {this.changeHandler} ref = "hometown" value={this.state.hometown} type="text" className="form-control" name="hometown" placeholder="Hometown"/>
                            </div>
                            <div className="form-group">
                                <input onChange = {this.changeHandler} ref = "languages" value={this.state.languages} type="text" className="form-control" name="languages" placeholder="Languages"/>
                            </div>
                            <div className="form-group">
                            <select style={{width:"100%"}} ref = "gender" onChange={this.changeHandler} value={this.state.gender} name="gender">
                                <option style={{color: "#ccc",}} value="" hidden>Gender</option>
                                <option name="male"> Male</option>
                                <option name="female">Female</option>
                                <option name="other">Other</option>
                            </select><br/>
                            <h6 align = "left"><small>This is never shared</small></h6>
                            </div>
                            <div className="form-group">
                                <input onChange = {this.changeHandler} ref = "phone" value={this.state.phone} type="text" className="form-control" name="phone" placeholder="Phone Number"/>
                            </div>
                        </div>  
                        <br></br>
                        <div className="col-md-10 text-center"> 
                            <button onClick = {this.saveChanges} className="btn-primary btn-lg" >Save Changes</button>
                        </div>
                        <br/>
                    </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return { profilefetch: state.profilefetch, profilesave: state.profilesave };
}

export default reduxForm({
    form: "UserProfileForm"
  })(connect(mapStateToProps, {profilefetch, profilesave}) (Profile) );