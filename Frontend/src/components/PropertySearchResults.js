import React, {Component} from 'react';
import 'typeface-roboto'
import './PropertySearchResults.css';
import cookie from 'react-cookies';
import {Navbar} from "react-bootstrap";
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';

import { propertysearch } from '../actions';
import { reduxForm } from "redux-form";
import { connect } from 'react-redux';

import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";

import Pagination from "./Pagination";

var longitude, lattitude, locationTitle;

class PropertySearchResults extends Component {
    
    constructor(props){
        super(props);
        console.log("Parameters are: ");
        console.log(this.props.history);
        this.state = {
            email: "",
            submitted: false,
            message: "",
            location : "",
            fromdate : "",
            todate : "",
            noOfGuests: "",
            isTravelerLoggedIn: false,
            detailsFetched:false,
            isLoading : true,
            allSearchData:[{}],
            currentSearchData:[{}],
            currentPage: null,
            totalPages: null,
            refreshTrips : false,
            textValue1: 0,
            textValue2: 1000,
            bedroomsLow: 0,
            bedroomsHigh: 0,
        };
        this.changeHandler = this.changeHandler.bind(this);
        this.handleValidation = this.handleValidation.bind(this);
        this.searchPlace = this.searchPlace.bind(this);
        this.renderSearchResult = this.renderSearchResult.bind(this);
        this.priceclear = this.priceclear.bind(this);
        this.bedroomsclear = this.bedroomsclear.bind(this);
        this.onSlide = this.onSlide.bind(this);
        this.logout = this.logout.bind(this);
    }

    onSlide = (render, handle, value, un) => {
        this.setState({
          textValue1: value[0].toFixed(0),
          textValue2: value[1].toFixed(0)
        });

    };

    priceclear = () => {
        this.setState({
            textValue1: 0,
            textValue2: 1000
            
        });

    };

    bedroomsclear = () => {
        this.setState({
            bedroomsLow: 0,
            bedroomsHigh: 0
        });

    };

    logout = () => {
        cookie.remove('cookie1', {path: '/'})
        cookie.remove('cookie2', {path: '/'})
        cookie.remove('cookie3', {path: '/'})
        console.log("All cookies removed!")
        window.location = "/"
    }
    
    onPageChanged = data => {

        console.log("page changed");
        const { currentPage, totalPages, pageLimit } = data;

        const requestDataPageChange = { 
            city : this.props.location.state?this.props.location.state.location:"",
            startDate : this.props.location.state?this.props.location.state.fromDate:"",
            endDate : this.props.location.state?this.props.location.state.toDate:"",
            noOfGuests: this.props.location.state?this.props.location.state.noOfGuests:"",
            priceLow: this.state.textValue1,
            priceHigh: this.state.textValue2,
            bedroomsLow: this.state.bedroomsLow,
            bedroomsHigh: this.state.bedroomsHigh,
            currentPage: currentPage, 
            pageLimit: pageLimit,
        }

        this.props.propertysearch(requestDataPageChange, sessionStorage.getItem('jwtToken'))
            .then(response => {
                console.log("Status Code : ", response.payload.status);
                if(response.payload.status === 200){
                    if (response.payload.data.length > 0){
                        this.setState({
                            currentSearchData : response.payload.data,
                            isLoading : false,
                            refreshTrips: false,
                        });
                        this.setState({ currentPage, totalPages });
                    }
                }
            });
    }

    componentWillMount(){
        this.setState ({ 
            location : this.props.location.state?this.props.location.state.location:"",
            fromdate : this.props.location.state?this.props.location.state.fromDate:"",
            todate : this.props.location.state?this.props.location.state.toDate:"",
            noOfGuests: this.props.location.state?this.props.location.state.noOfGuests:""
        })

        const data = { 
            city : this.props.location.state?this.props.location.state.location:"",
            startDate : this.props.location.state?this.props.location.state.fromDate:"",
            endDate : this.props.location.state?this.props.location.state.toDate:"",
            noOfGuests: this.props.location.state?this.props.location.state.noOfGuests:"",
            priceLow: this.state.textValue1,
            priceHigh: this.state.textValue2,
            bedroomsLow: this.state.bedroomsLow,
            bedroomsHigh: this.state.bedroomsHigh,
            currentPage: 1, 
            pageLimit: 0,
        }
        console.log("Calling Property Search in Will mount");
        console.log(data);
        this.props.propertysearch(data, sessionStorage.getItem('jwtToken'))
        .then(response => {
            console.log("Status Code : ",response.payload.status);
            if(response.payload.status === 200){
                if (response.payload.data.length > 0){
                    console.log(response.payload.data)
                    this.setState({
                        allSearchData : response.payload.data,
                        detailsFetched: true,
                    });
                }
            }
        })
    }

    renderSearchResult () {
        const {currentSearchData} = this.state;
        const {isLoading} = this.state;

        if(!isLoading){
            return Object.keys(currentSearchData).map((i) => {
                    return <div className="brdr bgc-white box-shad1 btm-mrg-20 property-listing" key={currentSearchData[i].ID}>
                    <div className="media">
                        <img alt="Thumbnail View of Property" style={{height: "230px", width: "240px"}}src={`http://localhost:3001/uploads/${currentSearchData[i].image1}`} />
                        <div className="clearfix visible-sm"> </div>
                            <div className="media-body fnt-smaller">
                                <input id = "heading" style={{paddingLeft: "10px"}} value = {currentSearchData[i].headline} type="text" readOnly="readOnly" />
                                <br></br><br></br>
                                <ul className="list-inline" style={{paddingLeft: "10px"}}>
                                    <li className = "list-inline-item"><i className="fas fa-home"></i></li>
                                    <li className = "list-inline-item">{currentSearchData[i].propertyType}</li>
                                    <li className = "list-inline-item"><i className="fas fa-bed"></i></li>
                                    <li className = "list-inline-item"> {currentSearchData[i].bedrooms} BR</li>
                                    <li className = "list-inline-item"><i className="fas fa-bath"></i></li>
                                    <li className = "list-inline-item"> {currentSearchData[i].bathrooms} BA</li>
                                    <li className = "list-inline-item"><i className="fas fa-user"></i></li>
                                    <li className = "list-inline-item"> Sleeps  {currentSearchData[i].sleeps}</li>
                                </ul>
                                <br></br><br></br><br></br>
                                <div className="input-group">
                                    <span className="input-group-prepend">
                                        <div className="input-group-text" style={{border: "none"}}><i className="fa fa-bolt" style={{fontSize: "24px"}}></i></div>
                                    </span>
                                    <input type="text" className="form-control" style ={{background: "#ededed"}} id = "heading1" defaultValue = {currentSearchData[i].currency + ' ' + currentSearchData[i].baseRate} type="text" readOnly />
                                </div>
                                <div className="input-group">
                                    <h5 style ={{background: "#ededed", width: "511px"}}> <small>View details for total price</small> </h5>
                                    <span className="input-group-append" style={{height: "22px",}}>
                                        <div className="input-group-text" style={{border: "none"}}>
                                            <i className="fas fa-star" style={{fontSize: "10px"}}></i>
                                            <i className="fas fa-star" style={{fontSize: "10px"}}></i>
                                            <i className="fas fa-star" style={{fontSize: "10px"}}></i>
                                            <i className="fas fa-star" style={{fontSize: "10px"}}></i>
                                            <i className="fas fa-star" style={{fontSize: "10px"}}></i>
                                            (1)
                                        </div>
                                        
                                    </span>
                                </div>
                                <Link className="view" to={`/property/${currentSearchData[i]._id}/${this.state.location}/${this.state.fromdate}/${this.state.todate}/${this.state.noOfGuests}`} target="_blank">Dummy Link</Link>
                            </div>
                        </div>
                    </div>
            });
            }
    }

    changeHandler(e) {
        console.log(e.target.value);
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleValidation(){
        let formIsValid = true;
    
        //Location
        if(!this.state.location){
            formIsValid = false;
            alert("Search Location is a Required field");
            console.log("Search Location cannot be empty");
        }
    
        //From Date
        if(!this.state.fromdate){
          formIsValid = false;
          alert("From Date is a Required field");
          console.log("From Date cannot be empty");
        } else {
          var CurrentDate = new Date();
          CurrentDate.setHours(0,0,0,0);
          var GivenfromDate = new Date(this.state.fromdate.replace(/-/g, '\/'));
          if(GivenfromDate < CurrentDate){
            alert('From date should be greater than the current date.');
            formIsValid = false;
          }
        }
    
        //To Date
        if(!this.state.todate){
            formIsValid = false;
            alert("To Date is a Required field");
            console.log("To Date cannot be empty");
         } else {
          var CurrentDate = new Date();
          CurrentDate.setHours(0,0,0,0);
          var GiventoDate = new Date(this.state.todate.replace(/-/g, '\/'));
    
          if(GiventoDate < CurrentDate){
            alert('To date should be greater than the current date.');
            formIsValid = false;
          } else {
            if (GiventoDate <= GivenfromDate){
              alert('To date should be greater than from date.');
              formIsValid = false;
            }
          }
        }
    
         //Numberof guests
        if(!this.state.noOfGuests){
          formIsValid = false;
          alert("Number of guests is a Required field");
          console.log("No. of Guests cannot be empty");
        }
       return formIsValid;
    }

    //search location handler to send a request to the node backend
    searchPlace(event) {
        console.log("Inside search property");
        //prevent page from refresh
        event.preventDefault();
        this.setState({ submitted: true });
        if(this.handleValidation()){
            const requestData = {
                city : this.state.location,
                startDate : this.state.fromdate,
                endDate : this.state.todate,
                noOfGuests : this.state.noOfGuests,
                priceLow: this.state.textValue1,
                priceHigh: this.state.textValue2,
                bedroomsLow: this.state.bedroomsLow,
                bedroomsHigh: this.state.bedroomsHigh,
                currentPage: 1, 
                pageLimit: 0,
            }
        
            this.setState({
                detailsFetched: false,
                submitted: true,
            });
            
            this.props.propertysearch(requestData, sessionStorage.getItem('jwtToken'))
                .then(response => {
                    console.log("Status Code : ", response.payload.status);
                    if(response.payload.status === 200){
                        if (response.payload.data.length > 0){
                            this.setState({
                                allSearchData : response.payload.data,
                                isLoading : false,
                                detailsFetched: true,
                                refreshTrips: true,
                            });
                        } else {
                            const allSearchData = response.payload.data;
                            this.setState({
                                allSearchData,
                                detailsFetched: false,
                                refreshTrips: false,
                            });
                        }
                    }
                })
                .catch (error => {
                    console.log(error);
                });
        }
    }

    render(){

        console.log('cookie1');
        if(cookie.load('cookie1') === 'travellercookie'){
            this.state.isTravelerLoggedIn = true
        }

        const { currentPage, totalPages, allSearchData, refreshTrips, detailsFetched, textValue1, textValue2, bedroomsLow, bedroomsHigh} = this.state;
        const totalSearchData = allSearchData.length;

        console.log("detailsFetched:", detailsFetched);
        console.log("totalSearchData:", totalSearchData);

        if(this.state.location.toLowerCase() === "san diego"){
            lattitude = 32.736349;
            longitude = -117.177871;
            locationTitle = this.state.location
        }
        if(this.state.location.toLowerCase() === "sunnyvale"){
            lattitude = 37.3688;
            longitude = -122.0363;
            locationTitle = this.state.location
            }
        if(this.state.location.toLowerCase() === "los angeles") {
            lattitude = 34.024212;
            longitude = -118.496475;
            locationTitle = this.state.location
        }
        if(this.state.location.toLowerCase() === "new york") {
            lattitude = 40.730610;
            longitude = -73.935242;
            locationTitle = this.state.location
        }
        if(this.state.location.toLowerCase() === "san franscisco") {
            lattitude = 37.773972;
            longitude = -122.431297;
            locationTitle = this.state.location
        }
        
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
                    <button id="blue" className="btn" style = {{fontColor : "black", backgroundColor:"white", background:"white", borderColor:"white"}} type="button"><a >Trip Boards</a></button>
                    {!this.state.isTravelerLoggedIn 
                    ?
                    (
                    <div className="btn btn-group" id="white">
                        <button id="blue" className="dropdown-toggle"  style = {{backgroundColor:"transparent", background:"transparent", borderColor:"transparent"}} type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><a >Login</a></button>
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
                        <a href="/inbox" title = "HomeAway" className = "logo"><img style = {{marginRight: "20px", }} alt="Mailbox" src={require('./mailbox.png')}/></a>
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
                        <div className="col-md-4 col-md-offset-3" style = {{marginLeft: "-50px"}}>
                            <div className="form-group">
                            <div className="input-group">
                                <span className="input-group-prepend">
                                    <div className="input-group-text form-control" ><i className="fa fa-map-marker"></i></div>
                                </span>
                                <input type="text" style ={{height: "60px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}} className="form-control"  defaultValue = {this.state.location} name="location" id="location" placeholder="Where do you want to go?" onChange = {this.changeHandler}/>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-offset-3">
                            <div className="form-group card" style = {{ height: "60px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}}>
                            <input placeholder="Arrive" defaultValue = {this.state.fromdate} onChange = {this.changeHandler} name="fromdate" type = "date" style ={{height: "60px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}} className="form-control" value={this.state.fromdate}/>
                            </div>
                        </div>
                        <div className="col-md-offset-3" style = {{marginLeft: "13px"}}>
                            <div className="form-group card" style = {{height: "60px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}}> 
                            <input placeholder="Depart" defaultValue = {this.state.todate} onChange = {this.changeHandler} name="todate" type = "date" style ={{height: "60px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}} className="form-control" value={this.state.todate}/>
                            </div>
                        </div>
                        <div className="col-md-offset-3" style = {{marginLeft: "13px", width: "18%"}}>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-prepend">
                                        <div className="input-group-text form-control" ><i className="fa fa-user-friends"></i></div>
                                    </span>
                                    <input type="number" min = "1" onChange = {this.changeHandler} name="noOfGuests" style ={{height: "60px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}} className="form-control" value= {this.state.noOfGuests}/>
                                </div>
                            </div> 
                        </div>
                        <div className="col-md-offset-3" style = {{marginLeft: "13px"}}>
                        <div className="form-group">
                            <button className="btn btn-primary" onClick = {this.searchPlace} style = {{ height: "60px", borderColor: "#ffffff", backgroundColor:"#0067db", width: "120px", borderRadius: 25}} data-effect="ripple" type="button" tabIndex="5" data-loading-animation="true">
                                Search
                            </button>
                        </div>
                        </div>
                    </div>
                </div>
            </Navbar>
            <div>
                <div id="baselayer" className="form-control" style={{borderRightStyle: "none", zIndex: "0", borderLeftStyle: "none"}}>
                    <div style={{backgroundColor: "white", border: "1px #ededed"}} >
                    <div className="row">
                        <div className="col-xs-4 col-xs-offset-3" >
                            <div className="btn btn-group" id="white" >
                                {textValue1 === 0 && textValue2 === 1000
                                ?
                                (
                                    <button id="blue" className="dropdown-toggle"  style = {{backgroundColor:"transparent", background:"transparent", borderColor:"transparent"}} type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><a >Any Price</a></button>
                                )
                                :
                                (
                                    <button id="blue" className="dropdown-toggle"  style = {{backgroundColor:"transparent", background:"transparent", borderColor:"transparent"}} type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><a >${textValue1 + ' - ' + '$' + textValue2}</a></button>
                                )
                                }
                                <div className="dropdown-menu"  style={{width: "450px", height: "200px"}}>
                                    <div>
                                        <h5 style = {{marginLeft: "25px", fontFamily: "Verdana", color: "grey"}}><small> Price Per Night  </small></h5>
                                        {textValue1 !== 0 && textValue2 == 1000
                                        ?
                                        (
                                            <h5 style = {{marginLeft: "25px", fontFamily: "Verdana"}}><small> ${textValue1 + '+'} </small></h5>
                                        )
                                        :
                                        (
                                            <h5 style = {{marginLeft: "25px", fontFamily: "Verdana"}}><small> ${textValue1 + ' - ' + '$' + textValue2} </small></h5>
                                        )
                                        }
                                        <br></br>
                                    </div>
                                    <Nouislider
                                        connect
                                        start={[0, 1000]}
                                        step={25}
                                        behaviour="tap"
                                        range={{
                                            min: [0],
                                            max: [1000],
                                        }}
                                        onSlide={this.onSlide}
                                    />
                                    <br></br>
                                    <button className="btn btn-primary" onClick = {this.priceclear} style = {{ marginLeft: "180px", height: "60px", borderColor: "#ffffff", backgroundColor:"#0067db", width: "120px", borderRadius: 25}} data-effect="ripple" type="button" tabIndex="5" data-loading-animation="true">
                                        Clear
                                    </button>
                                    <button className="btn btn-primary" onClick = {this.searchPlace} style = {{ marginLeft: "20px", height: "60px", borderColor: "#ffffff", backgroundColor:"#0067db", width: "120px", borderRadius: 25}} data-effect="ripple" type="button" tabIndex="5" data-loading-animation="true">
                                        Apply Filter
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-4 col-xs-offset-3" >
                            <div className="btn btn-group" id="white" >
                                {bedroomsHigh === 0
                                ?
                                (
                                    <button id="blue" className="dropdown-toggle"  style = {{backgroundColor:"transparent", background:"transparent", borderColor:"transparent"}} type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><a >Any bedrooms</a></button>
                                )
                                :
                                (
                                    <button id="blue" className="dropdown-toggle"  style = {{backgroundColor:"transparent", background:"transparent", borderColor:"transparent"}} type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><a >{bedroomsLow + ' - ' + bedroomsHigh} bedrooms</a></button>
                                )
                                }
                                <div className="dropdown-menu"  style={{width: "300px", height: "300px"}}>
                                    <div className={'form-group' + (bedroomsLow > bedroomsHigh ? ' has-error' : '')}>
                                        <div className="row">
                                            <div className="col-md-4 col-md-offset-3" style = {{marginLeft: "35px", width: "25%"}}>
                                                <div className="input-group">
                                                    <input type="number" min = "0" placeholder="Min:" onChange = {this.changeHandler} value={this.state.bedroomsLow} name="bedroomsLow" style ={{height: "40px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}} className="form-control"/>
                                                </div>
                                            </div>    
                                            <div className="col-md-offset-3" style = {{marginLeft: "35px", width: "25%"}}>
                                                <div className="input-group">
                                                    <input type="number" min = "0" placeholder="Max:" onChange = {this.changeHandler} value={this.state.bedroomsHigh} name="bedroomsHigh" style ={{height: "40px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}} className="form-control"/>
                                                </div>
                                            </div>
                                            <br></br>
                                        </div>
                                        {bedroomsLow > bedroomsHigh &&
                                            <div style = {{paddingLeft: "10px", paddingRight: "10px",}}>
                                                <br></br>
                                                <div style = {{whiteSpace: "normal"}} className={`alert alert-danger`}>Minimum bedroom count may not exceed maximum bedroom count</div>
                                            </div> 
                                        }
                                    </div>
                                    <br></br>
                                    <button className="btn btn-primary" onClick = {this.bedroomsclear} style = {{ marginLeft: "20px", height: "60px", borderColor: "#ffffff", backgroundColor:"#0067db", width: "120px", borderRadius: 25}} data-effect="ripple" type="button" tabIndex="5" data-loading-animation="true">
                                        Clear
                                    </button>
                                    <button className="btn btn-primary" onClick = {this.searchPlace} style = {{ marginLeft: "20px", height: "60px", borderColor: "#ffffff", backgroundColor:"#0067db", width: "120px", borderRadius: 25}} data-effect="ripple" type="button" tabIndex="5" data-loading-animation="true">
                                        Apply Filter
                                    </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div  id="frontlayer"><br/><br/>
                            <div style = {{marginLeft: "950px", marginTop: "170px",  width : "950px"}}>
                                <Map
                                    id="myMap"
                                    options={{
                                    center: { lat: lattitude, lng:  longitude },
                                    zoom: 8
                                    }}
                                    onMapLoad={map => {
                                    var marker = new window.google.maps.Marker({
                                        position: { lat: lattitude, lng:  longitude},
                                        map: map,
                                        title: locationTitle
                                    });
                                    }}
                                />
                        </div>
                    </div>
                </div>
            </div>
            <div className = "container-full" >
                <div className="container-pad">
                    <div className="container mb-3" style = {{marginBottom: "20px !important", marginLeft: "0px", maxWidth: "860px",}}>
                        <div className="row d-flex" style={{height: "70px", padding : "0px 0px 0px 0px"}}>
                            <div className="w-100 px-4 py-5 d-flex flex-row flex-wrap align-items-center justify-content-between" style = {{paddingTop : "0px",}}>
                            {detailsFetched &&
                            (
                                <div className="d-flex flex-row py-4 align-items-center" style={{marginLeft: "-20px",}}>
                                    <Pagination
                                        totalRecords={totalSearchData}
                                        pageLimit={10}
                                        pageNeighbours={1}
                                        onPageChanged={this.onPageChanged}
                                        refresh={refreshTrips}
                                    />
                                </div>
                            )
                            }
                            {detailsFetched &&
                            (
                                <div className="d-flex flex-row align-items-center">
                                    {currentPage && (
                                        <span className="current-page d-inline-block h-100 pl-4 text-secondary" style={{fontSize: "17px",}}>
                                        Page <span className="font-weight-bold">{currentPage}</span> /{" "}
                                        <span className="font-weight-bold">{totalPages}</span>
                                        </span>
                                    )}
                                </div>
                            )}
                            </div>
                        </div>
                    </div>
                    {detailsFetched &&
                    (
                        <div className="form-row">
                            <div className="form-group col-sm-8" id = "property-listings" style ={{maxWidth : "860px"}}>
                                <div className ="Content">
                                    { this.renderSearchResult() }
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {!detailsFetched &&
            (
                <div className = "container-full">
                    <div className="container-pad" style={{textAlign: "center"}}>
                    <h3> <small>There are no results which match your criteria. Try refining your search parameters.</small></h3>
                    </div>
                </div>
            )}
        </div>
        )
    }
}

class Map extends Component {
    constructor(props) {
      super(props);
      this.onScriptLoad = this.onScriptLoad.bind(this)
    }
  
    onScriptLoad() {
      const map = new window.google.maps.Map(
        document.getElementById(this.props.id),
        this.props.options);
      this.props.onMapLoad(map)
    }
  
    componentDidMount() {
      if (!window.google) {
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.src = `https://maps.google.com/maps/api/js?key=AIzaSyCpk67Ig02fwUNe7in4kt0H23kahGTbLm8`;
        var x = document.getElementsByTagName('script')[0];
        x.parentNode.insertBefore(s, x);
        // Below is important. 
        //We cannot access google.maps until it's finished loading
        s.addEventListener('load', e => {
          this.onScriptLoad()
        })
      } else {
        this.onScriptLoad()
      }
    }
  
    render() {
      return (
        <div style = {{width : "600px", height :"700px"}} id={this.props.id} />
      );
    }
  }

  function mapStateToProps(state) {
    return { propertysearch: state.propertysearch };
  }
  
  export default reduxForm({
    form: "OwnerPropertyPostForm"
  })(connect(mapStateToProps, {propertysearch}) (PropertySearchResults) );