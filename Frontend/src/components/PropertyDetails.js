import React, {Component} from 'react';
import './PropertyDetails.css';
import 'typeface-roboto'
import cookie from 'react-cookies';
import moment from 'moment';
import {Navbar} from "react-bootstrap";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import Helmet from 'react-helmet';
import Tabs from 'react-web-tabs/lib/Tabs';
import Tab from 'react-web-tabs/lib/Tab';
import TabPanel from 'react-web-tabs/lib/TabPanel';
import TabList from 'react-web-tabs/lib/TabList';
import SweetAlert from 'react-bootstrap-sweetalert';
import Popup from "reactjs-popup";

import { propertydetails, propertybook, sendmail } from '../actions';
import { reduxForm } from "redux-form";
import { connect } from 'react-redux';

class PropertyDetails extends Component {
    constructor(props){
        super(props);
        this.state = {
          isTravelerLoggedIn: false,
          propertyid: this.props.match.params.id,
          location : this.props.match.params.location,
          fromdate : this.props.match.params.fromdate,
          todate : this.props.match.params.todate,
          noOfGuests:this.props.match.params.noOfGuests,
          guests :"",
          nightlyrate : "",
          bookingFromDate :"",
          bookingToDate :"",
          isLoading : true,
          price : 0,
          propertyDetails: [{}],
          adate : false,
          ddate : false,
          pguests : false,
          alert: null,
          booked : false,
          open: false,
          mailcontent :"",
        };
        this.logout = this.logout.bind(this);
        this.fromDateChangeHandler = this.fromDateChangeHandler.bind(this);
        this.toDateChangeHandler = this.toDateChangeHandler.bind(this);
        this.noOfGuestsChangeHandler = this.noOfGuestsChangeHandler.bind(this);
        this.submitBooking = this.submitBooking.bind(this);
        this.openPopup = this.openPopup.bind(this);
        this.closePopup = this.closePopup.bind(this);
        this.messageChangeHandler = this.messageChangeHandler.bind(this);

    }
    
    componentWillMount () {
        console.log("In Property Details");
        var propertyID = this.state.propertyid;

        if(cookie.load('cookie1') === 'travellercookie'){
            this.setState({ isTravelerLoggedIn: true });
        }

        this.props.propertydetails(propertyID, sessionStorage.getItem('jwtToken'))
        .then(response => {
            console.log("Status Code in Property details fetch: ", response.payload.status);
            if(response.payload.status === 200){
                console.log(response.payload.data)
                this.setState({propertyDetails : response.payload.data})
            }
            
        });
    }
    
    fromDateChangeHandler = (e) => { 
        e.preventDefault();
        this.setState({bookingFromDate : e.target.value,
            adate: true
        })
    }

    toDateChangeHandler = (e) => {
        e.preventDefault();
        this.setState({bookingToDate : e.target.value,
             ddate: true
        })
    }

    noOfGuestsChangeHandler = (e) => {
        this.setState ({
            guests : e.target.value,
            pguests : true
        })
    }

    handleValidation(){
        let formIsValid = true;
    
        //From Date
        if(this.state.bookingFromDate < this.state.fromdate || this.state.bookingFromDate > this.state.todate){
            alert('Arrive date should be between the searched dates');
            formIsValid = false;
        }
    
        //To Date
        if(this.state.bookingToDate < this.state.fromdate || this.state.bookingToDate > this.state.todate){
            alert('Depart date should be between the searched dates');
            formIsValid = false;
        }

        if(this.state.bookingFromDate >= this.state.bookingToDate){
            alert('Arrival date should be before departure date');
            formIsValid = false;
        }
    
         //Numberof guests
        if(this.state.guests > this.state.noOfGuests){
            alert("Number of guests should be less than or same as the searched criteria");
            formIsValid = false;
        }
       return formIsValid;
    }

    logout = () => {
        cookie.remove('cookie1', {path: '/'})
        cookie.remove('cookie2', {path: '/'})
        cookie.remove('cookie3', {path: '/'})
        console.log("All cookies removed!")
        window.location = "/"
    }

    shouldComponentUpdate(nextState) {
        if (nextState.bookingFromDate !== this.state.bookingFromDate) {
            return true; }
        if (nextState.bookingToDate !== this.state.bookingToDate) {
            return true; }
        else {
            return false }
    }

    shouldComponentUpdate(prevState){
        if (prevState.bookingFromDate !== this.state.bookingFromDate){
            return true;
        }
        if (prevState.bookingToDate !== this.state.bookingToDate){
            return true;
        } else {
            return false
        }
    }

    submitBooking = () => {
        if(this.handleValidation()){
            const getAlert = () => (
                <SweetAlert 
                success 
                title = "Congratulations!!"
                onConfirm={() => this.addBooking()}> 
                You successfully booked this property!!!
                </SweetAlert>
            );
     
            if (this.state.adate && this.state.ddate && this.state.pguests && this.state.isTravelerLoggedIn) {
                this.setState({
                    alert: getAlert(),
                    //booked: true
                })
            } else {
                if (!this.state.isTravelerLoggedIn){
                    window.alert("You must be logged in to book this property!!!")}
                else{
                    window.alert("Please enter all the fields")
                }
            }
        }
    }

    addBooking(){
    
        var price = this.state.price
        price = price.toString();
        var travellerName = cookie.load('cookie3') + cookie.load('cookie4');
        var data = {
            propertyid: this.state.propertyid,
            bookedBy: cookie.load('cookie2'),
            travellerName: travellerName,
            bookedFrom : this.state.bookingFromDate,
            bookedTo : this.state.bookingToDate,
            NoOfGuests : this.state.guests,
            pricePaid : price
        }

        this.props.propertybook(data, sessionStorage.getItem('jwtToken'))
        .then(response => {
            console.log("Status Code : ",response.payload.status);
            if(response.payload.status === 200){
                console.log("booked property")
                window.close();
            }
        });
    }

    openPopup = () => {
        if (this.state.isTravelerLoggedIn){
            if (this.state.adate && this.state.ddate && this.state.pguests) {
                this.setState({ open: true });
            }
            else {
                window.alert("Please enter all the booking info")
            }
        } else {
            window.alert("You must be logged in to message the owner!!!")
        }
    };

    closePopup = () => {
        this.setState({ open: false });
    };

    messageChangeHandler = (event) => {
        this.setState ({
            mailcontent : event.target.value
        })
    }

    sendMessage = () => {

        if (this.handleValidation()) {

            if (this.state.adate && this.state.ddate && this.state.pguests && this.state.isTravelerLoggedIn) {

                var data = {
                    sendername : cookie.load('cookie3') + ' ' + cookie.load('cookie4'),
                    senderemail : cookie.load('cookie2'),
                    receiver : this.state.propertyDetails.listedBy,
                    mailcontent : this.state.mailcontent,
                    propertyid : this.state.propertyDetails._id,
                    propertylocated : this.state.propertyDetails.city,
                    propertyheader : this.state.propertyDetails.headline,
                    checkin : this.state.bookingFromDate,
                    checkout : this.state.bookingToDate,
                    guests : this.state.guests,
                    reply : false
                }
    
                console.log("send message")
                this.props.sendmail(data, sessionStorage.getItem('jwtToken')).then(response => {
                    if(response.payload.status === 200){
                        console.log(response.payload.data)
                        this.setState({result : response.payload.data})
                    }
                });
    
                this.setState({ open: false });
            } else {
                if (!this.state.isTravelerLoggedIn){
                    window.alert("You must be logged in to book this property!!!")
                }
                else {
                    window.alert("Please enter all the fields")
                }
            }
        }
    };

    render(){

        const {propertyDetails} = this.state;

        var start = moment(this.state.bookingFromDate, "YYYY-MM-DD");
        var end = moment(this.state.bookingToDate, "YYYY-MM-DD");
        //Difference in number of days
        var difference = (moment.duration(end.diff(start)).asDays());
        var price = difference * propertyDetails.baseRate;

        this.state.price = price;

        return(
          <div>
            <Helmet>
              <style>{'body { background-color: white; }'}</style>
            </Helmet>
            <Navbar>
                <Navbar.Header>
                    <Navbar.Brand>
                    <a href="/" title = "HomeAway" className = "logo"><img src={require('./homeaway_logo.png')} alt="Homeaway Logo"/></a>
                    </Navbar.Brand>
                </Navbar.Header>
                <div className="box">
                    <div>
                        <img style={{marginTop: "13px"}} alt="US Flag" src={require('./us_flag.png')}/>
                    </div>
                    <button id="blue" className="btn" style = {{fontColor : "black", backgroundColor:"white", background:"white", borderColor:"white"}} type="button"><a>Trip Boards</a></button>
                    {!this.state.isTravelerLoggedIn 
                    ?
                    (
                    <div className="btn btn-group" id="white">
                        <button id="blue" className="dropdown-toggle"  style = {{backgroundColor:"transparent", background:"transparent", borderColor:"transparent"}} type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><a>Login</a></button>
                        <div className="dropdown-menu">
                            <a className="dropdown-item" href="/traveller/login">Traveller Login</a>
                            <a className="dropdown-item" href="/owner/login">Owner Login</a>
                        </div>
                    </div>
                    )
                    :
                    (
                    <div>
                        <div className="btn btn-group" id="white" style = {{marginRight: "160px", width: "50px", }}>
                            <button className="dropdown-toggle" style = {{color: "#0067db", backgroundColor:"transparent", background:"transparent", borderColor:"transparent"}} type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Hello {cookie.load('cookie3')}</button>
                            <div className="dropdown-menu">
                            <a className="dropdown-item" href="/Profile"> <i className="fas fa-envelope"></i> Inbox</a>
                            <a className="dropdown-item" href="/traveller/mytrips"> <i className="fas fa-briefcase"></i> My Trips</a>
                            <a className="dropdown-item" href="/Profile"> <i className="fas fa-user"></i> My Profile</a>
                            <a className="dropdown-item"  onClick= {this.logout}> <i className="fas fa-sign-out-alt"></i> Logout</a>
                            </div>
                        </div>
                        <img style = {{marginRight: "20px", }} alt="US Flag" src={require('./mailbox.png')}/>
                    </div>
                    )
                    }
                    <button className="btn" style = {{color: "#fff", fontSize: "15px", margin: "0 15px", padding: "12px 40px",fontFamily: "Lato,Arial,Helvetica Neue,sans-serif", height: "40px", backgroundColor:"#fff", width: "200px", borderRadius: "40px", borderColor: "#d3d8de"}} data-effect="ripple" type="button" tabIndex="5" data-loading-animation="true">
                        <a href="/owner/login">List your Property</a>
                    </button>
                    <img src={require('./logo.png')} alt="Homeaway Logo"/>
                </div>
            <div className="container" style = {{marginTop :"1%"}}>
              <div className="row">
                  <div className="col-md-4 col-md-offset-3">
                      <div className="form-group">
                        <div className="input-group">
                            <span className="input-group-prepend">
                                <div className="input-group-text form-control" ><i className="fa fa-map-marker"></i></div>
                            </span>
                            <input type="text" style ={{height: "60px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}} className="form-control" name="search" id="search" defaultValue = {this.state.location} readOnly/>
                        </div>
                      </div>
                  </div>
                  <div className="col-md-offset-3">
                      <div className="form-group card" style = {{ height: "60px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}}>
                        <input placeholder="Arrive" type = "date" style ={{height: "60px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}} className="form-control" value={this.state.fromdate} readOnly />
                      </div>
                  </div>
                  <div className="col-md-offset-3" style = {{marginLeft: "13px"}}>
                      <div className="form-group card" style = {{height: "60px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}}> 
                        <input placeholder="Depart" style ={{height: "60px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}} className="form-control" type = "date" readOnly value={this.state.todate} />
                      </div>
                  </div>
                  <div className="col-md-offset-3" style = {{marginLeft: "13px"}}>
                      <div className="form-group">
                        <div className="input-group">
                            <span className="input-group-prepend">
                                <div className="input-group-text form-control" ><i className="fa fa-user-friends"></i></div>
                            </span>
                            <input type="text" style ={{height: "60px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}} className="form-control" value= {this.state.noOfGuests} readOnly/>
                        </div>
                      </div> 
                  </div>
                  </div>
            </div>
            </Navbar>
            <div className = "container-full">
                <div className="container-pad">
                    <div className="form-row ">
                        <div className="form-group col-sm-8 FixedHeightContainer border" id = "property-listings" style ={{maxWidth : "1000px"}}>
                            <div style = {{background: "#D6EBF2"}}  className ="Content">
                                <Carousel showThumbs={false}>
                                    <div>
                                        <img className="img-responsive" src={`http://localhost:3001/uploads/${propertyDetails.image1}`} />
                                    </div>
                                    <div>
                                        <img className="img-responsive" src={`http://localhost:3001/uploads/${propertyDetails.image2}`} />
                                    </div>
                                    <div>
                                        <img className="img-responsive" src={`http://localhost:3001/uploads/${propertyDetails.image3}`} />
                                    </div>
                                    <div>
                                        <img className="img-responsive" src={`http://localhost:3001/uploads/${propertyDetails.image4}`} />
                                    </div>
                                    <div>
                                        <img className="img-responsive" src={`http://localhost:3001/uploads/${propertyDetails.image5}`} />
                                    </div>
                                </Carousel>
                                <div>
                                    <Tabs defaultTab="one"
                                        onChange={(tabID) => { console.log(tabID)}}>
                                        <TabList>
                                        <div className="topnav">
                                            <div className = "row">
                                            <div className = "col-md-2">
                                                <Tab tabFor="one" style = {{marginTop : "20px", borderRight :"none", borderLeft :"none", padding : "0 0 0 0"}}><a>Overview</a></Tab>
                                            </div>
                                            <div className = "col-md-2">
                                                <Tab tabFor="two" style = {{marginTop : "20px", borderRight :"none", borderLeft :"none", padding : "0 0 0 0"}}><a>Amenities</a></Tab>
                                            </div>
                                            </div>
                                        </div>
                                        </TabList>
                                        <TabPanel tabId="one">
                                            <div className = "container" style = {{marginTop : "20px"}}>
                                                <h4 className="media-heading"><img style={{height: "35px"}} alt="Small Map" src={require('./maps-icon.png')}/>{propertyDetails.headline}</h4>
                                                <div className = "row" style = {{marginTop :"20px"}}>
                                                <h2><img alt="Pindrop Sign" style={{height: "35px"}} src={require('./pindrop.png')}/>{propertyDetails.city}, {propertyDetails.state}, {propertyDetails.country}</h2>
                                                </div>
                                                <div className = "row" style = {{marginTop :"20px"}}>
                                                <ul className="list-inline">
                                                    <li className = "list-inline-item">{propertyDetails.propertyType}</li>
                                                    <li className = "list-inline-item dot"></li>
                                                    <li className = "list-inline-item"> {propertyDetails.bedrooms} BR</li>
                                                    <li className = "list-inline-item dot"></li>
                                                    <li className = "list-inline-item"> {propertyDetails.bathrooms} BA</li>
                                                    <li className = "list-inline-item dot"></li>
                                                    <li className = "list-inline-item"> Sleeps  {propertyDetails.sleeps}</li>
                                                </ul>
                                                </div>
                                                <div className = "row" style = {{marginTop :"10px"}}>
                                                <p className = "para-font">{propertyDetails.description}</p>
                                                </div> 
                                            </div>
                                        </TabPanel>
                                        <TabPanel tabId = "two">
                                        <div className = "container" style = {{marginTop : "20px"}}>
                                                <hr/> 
                                                <div className = "row" style = {{marginTop :"20px"}}>
                                                <p className = "para-font">{propertyDetails.amenities}</p>
                                                </div>
                                            </div>
                                        </TabPanel>
                                    </Tabs>
                                </div>
                            </div>
                        </div>
                        <div className = "form-group col-md-3 border" style = {{height: "510px"}} >
                            <div className = "card-body " style = {{background: "#b4ecb4", width : "385px"}}>
                                <div className="row">
                                    <div className="col-xs-1"><h4 className="media-heading">$ {propertyDetails.baseRate}</h4></div>
                                    <div className="col-sm-2" style = {{marginTop : "6px"}}><h6 className="media-heading">avg/night</h6>
                                </div>
                            </div>
                            <div className = "container" style = {{marginTop : "30px"}}>
                                <div className="row">
                                    <div className="col-md-offset-3">
                                        <div className="form-group" style = {{marginLeft : "50px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}}>
                                            <h5>Arrive</h5>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-offset-6">
                                        <div className="form-group card" style = {{marginLeft : "50px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}}>
                                        <input placeholder="Arrive" onChange={this.fromDateChangeHandler} style = {{height: "40px", width: "180px"}} value={this.state.bookingFromDate} type="date" name="fromdate"/>
                                        </div>
                                    </div>
                                </div>
                                <div className = "row">
                                    <div className="col-md-offset-3">
                                        <div className="form-group " style = {{marginLeft : "50px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}}>
                                            <h5>Depart</h5>
                                        </div>
                                    </div>
                                </div>
                                <div className = "row">
                                    <div className="col-md-offset-6">
                                        <div className="form-group card" style = {{marginLeft : "50px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}}>
                                     <input placeholder="Depart" onChange={this.toDateChangeHandler} style = {{height: "40px", width : "180px"}} value={this.state.bookingToDate} type="date" name="todate"/>
                                        </div>
                                    </div>
                                </div>
                                <div className = "row">
                                    <div className="col-md-offset-3">
                                        <div className="form-group " style = {{marginLeft : "50px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}}>
                                            <h5>No. of Guests</h5>
                                        </div>
                                    </div>
                                </div>
                                <div className = "row">
                                    <div className="col-md-8" style={{marginLeft : "50px", maxHeight: "52px", maxWidth: "172px"}}>
                                        <div className="form-group card" style = {{width: "180px",  marginLeft : "-9px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}}>
                                            <div className="input-group" style={{height: "50px"}}>
                                                <span className="input-group-prepend">
                                                    <div className="input-group-text form-control" ><i className="fa fa-user-friends"></i></div>
                                                </span>
                                                <input type="mumber" style ={{height: "49px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}} className="form-control"
                                                value={this.state.guests} onChange = {this.noOfGuestsChangeHandler} min="1"/>
                                            </div> 
                                        </div>
                                    </div>
                                </div>
                                {(this.state.adate  && this.state.ddate && this.state.pguests ?
                                        <div className = "row">
                                            <div className="col-md-offset-3">
                                                <div className="form-group " style = {{fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}}>
                                                    <h5>Price for {difference} nights is ${this.state.price}</h5>
                                                </div>
                                            </div>
                                        </div>
                                :
                                null
                                )}
                                <div className="form-group" style ={{marginLeft : "50px", marginTop : "40px"}}>
                                    <button className="btn btn-primary" onClick = {this.submitBooking} style = {{ height: "60px", borderColor: "#ffffff", backgroundColor:"#0067db", width: "200px", borderRadius: 25}} data-effect="ripple" type="button" tabIndex="5" data-loading-animation="true">
                                        Book Now
                                    </button>
                                    {this.state.alert}
                                </div>
                                <hr/>
                                <button id="blue" className="btn" onClick={this.openPopup} style = {{marginLeft : "50px", fontColor : "black", backgroundColor:"white", background:"transparent", borderColor:"transparent"}} type="button">
                                    <a >Ask Manager a Question</a>
                                </button>
                                <Popup open={this.state.open} closeOnDocumentClick onClose={this.closePopup}>
                                    <div>
                                        <div className="popup1">
                                            <a className="close" onClick={this.closePopup}>&times;</a>
                                            <div className="header" style = {{marginTop : "30px", color: "blue"}}><h2>Ask Owner a Question</h2></div>
                                                <hr/>
                                                <div className="content">
                                                    <div className="row">
                                                        <div id="floatContainer1" className="col-md-3 float-container">
                                                            <label htmlFor="floatField4">Arrive</label>
                                                            <input id="shadownone" value = {this.state.bookingFromDate} name="adate" readOnly type="text"/>
                                                        </div>
                                                        <div id="floatContainer1" className = "col-md-3 float-container" style = {{marginLeft: "10px"}}>
                                                            <label htmlFor="floatField5">Depart</label>
                                                            <input id="shadownone" value = {this.state.bookingToDate} name="ddate" readOnly type="text"/>
                                                        </div>
                                                        <div id="floatContainer1" className="col-md-3 float-container" style = {{marginLeft: "10px", maxWidth: "180px"}}>
                                                            <label htmlFor="floatField6">No. of Guests</label>
                                                            <input id="shadownone" value = {this.state.guests} name="guests" readOnly type="text"/>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div id="floatContainer1" className="float-container">
                                                            <label htmlFor="floatField1">First Name</label>
                                                            <input id="shadownone" value = {cookie.load('cookie3')} name="firstname"readOnly type="text"/>
                                                        </div>
                                                        <div id="floatContainer1" className="float-container">
                                                            <label htmlFor="floatField2">Last Name</label>
                                                            <input id="shadownone" value = {cookie.load('cookie4')} name="lastname"  readOnly type="text"/>
                                                        </div>
                                                        <div id="floatContainer1" className="float-container">
                                                            <label htmlFor="floatField3">Email Address</label>
                                                            <input id="shadownone" value = {cookie.load('cookie2')} name="email" readOnly type="text"/>
                                                        </div>
                                                        <textarea id="message"  style={{width: "600px", marginLeft : "80px", }} onChange = {this.messageChangeHandler} cols="40" rows="5" placeholder="Message to Owner" className="form-control"></textarea>
                                                    </div>
                                                </div>
                                                <button className="btn btn-primary" onClick = {this.sendMessage} style = {{ height: "60px", borderColor: "#ffffff", backgroundColor:"#0067db", width: "120px", borderRadius: 25}} data-effect="ripple" type="button" tabIndex="5" data-loading-animation="true">
                                                    Send
                                                </button>
                                            </div>
                                        </div>
                                    </Popup>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
    }
}
  
function mapStateToProps(state) {
    return { 
        propertydetails: state.propertydetails,
        propertybook: state.propertybook,
        sendmailtoowner: state.sendmailtoowner,
    };
}

export default reduxForm({
    form: "PropertyDetailsForm"
  })(connect(mapStateToProps, {propertydetails, propertybook, sendmail}) (PropertyDetails) );
