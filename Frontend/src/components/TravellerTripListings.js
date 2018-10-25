import React, {Component} from 'react';
import 'typeface-roboto'
import './OwnerPropertyListings.css';
import './TravellerTripListings.css';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import {Navbar} from "react-bootstrap";
import moment from 'moment';
import { travellertrips } from '../actions';
import { reduxForm } from "redux-form";
import { connect } from 'react-redux';

import Pagination from "./Pagination";

class TravellerTripListings extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            email: "",
            isLoading : true,
            allTrips:[{}],
            currentTrips:[{}],
            detailsFetched:false,
            currentPage: null,
            totalPages: null,
            refreshTrips : false,
            searchString: null,
            submitted: false,
            fromdate: null,
            todate: null,
        };
        
        this.renderTrips = this.renderTrips.bind(this);
        this.logout = this.logout.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.searchProperty = this.searchProperty.bind(this);
    }

    logout = () => {
        cookie.remove('cookie1', {path: '/'})
        cookie.remove('cookie2', {path: '/'})
        cookie.remove('cookie3', {path: '/'})
        console.log("All cookies removed!")
        window.location = "/"
    }
    
    //search string, from date and to date change handler to update state variable with the text entered by the user
    changeHandler(e) {
        console.log(e.target.name,":" ,e.target.value);
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    searchProperty = () => {
        

        console.log("search property");
        const requestData = { 
            bookedBy : cookie.load('cookie2'),
            currentPage: 1, 
            pageLimit: 0,
            fromdate: this.state.fromdate,
            todate: this.state.todate,
        }

        this.setState({
            detailsFetched: false,
            submitted: true,
        });
        
        console.log(requestData),
        this.props.travellertrips(requestData, sessionStorage.getItem('jwtToken'))
        .then(response => {
            if(response.payload.status === 200){
                if (response.payload.data.length > 0){
                    if(this.state.searchString === "" || this.state.searchString === null){
                        const allTrips = response.payload.data;
                        this.setState({
                            allTrips,
                            detailsFetched: true,
                            refreshTrips: true,
                        });
                    } else {
                        var text = this.state.searchString.toLowerCase();
                        const allTrips = response.payload.data;
                        let searchedTrips1 = allTrips.filter((row) => {
                            return row.propertyDetails[0].headline.toLowerCase().includes(text);
                        });
                        if (searchedTrips1.length > 0){
                            this.setState ({
                                allTrips : searchedTrips1,
                                detailsFetched: true,
                                refreshTrips: true,
                            })
                        } else {
                            this.setState ({
                                allTrips : searchedTrips1,
                                detailsFetched: false,
                                refreshTrips: false,
                            })
                        }
                    }
                } else {
                    const allTrips = response.payload.data;
                    this.setState({
                        allTrips,
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

    onPageChanged = data => {

        console.log("page changed");
        const { currentPage, totalPages, pageLimit } = data;

        const requestDataPageChange = { 
            bookedBy : cookie.load('cookie2'),
            currentPage: currentPage, 
            pageLimit: pageLimit,
            fromdate: this.state.fromdate,
            todate: this.state.todate,
        }

        this.props.travellertrips(requestDataPageChange, sessionStorage.getItem('jwtToken'))
            .then(response => {
                console.log("Status Code : ", response.payload.status);
                if(response.payload.status === 200){
                    if(this.state.searchString === "" || this.state.searchString === null){
                        this.setState({
                            currentTrips : response.payload.data,
                            isLoading : false,
                            refreshTrips: false,
                        });
                    } else {
                        var text = this.state.searchString.toLowerCase();
                        const currentTrips = response.payload.data;
                        let searchedTrips2 = currentTrips.filter((row) => {
                            return row.propertyDetails[0].headline.toLowerCase().includes(text);
                        });
                        this.setState ({
                            currentTrips : searchedTrips2,
                            isLoading : false,
                            refreshTrips: false,
                        })
                    }
                    this.setState({ currentPage, totalPages });
                }
        });
    }

    componentWillMount(){
    
        const requestData = { 
            bookedBy : cookie.load('cookie2'),
            currentPage: 1, 
            pageLimit: 0,
            fromdate: this.state.fromdate,
            todate: this.state.todate,
        }

        this.props.travellertrips(requestData, sessionStorage.getItem('jwtToken'))
        .then(response => {
            console.log("Status Code in Will Mount: ", response.payload.status);
            if(response.payload.status === 200){
                console.log(response.payload.data)
                const allTrips = response.payload.data;
                this.setState({
                    allTrips,
                    detailsFetched: true
                });
            }
        })
        .catch (error => {
            console.log(error);
        });
    }

    renderTrips () {
        const {currentTrips} = this.state;
        const {isLoading} = this.state;

        if(!isLoading){
            console.log("generating trip cards...")
            return Object.keys(currentTrips).map((i) => {
                    return <div className="brdr bgc-fff pad-10 box-shad btm-mrg-20 myborder1 property-listing" key={currentTrips[i].ID}>
                    <div className="media">
                        <a className="pull-left" href="#" target="_parent">
                        <img alt="Thumbnail View of Property" className="img-responsive" src={`http://localhost:3001/uploads/${currentTrips[i].propertyDetails[0].image1}`} /></a>
                        <div className="media-body">  
                            <h4 className="myh4" style={{paddingLeft: "10px"}}>{currentTrips[i].propertyDetails[0].headline}</h4>
                            <h6 className="myh6" style={{paddingLeft: "10px"}}>{currentTrips[i].propertyDetails[0].description}</h6>
  
                            <ul className="list-inline" style={{paddingLeft: "10px"}}>
                                <li className = "list-inline-item"><img alt="Pindrop Sign" style={{height: "35px"}} src={require('./pindrop.png')}/></li>
                                <li className = "list-inline-item">{currentTrips[i].propertyDetails[0].streetAddress}</li>
                                <li className = "list-inline-item">{currentTrips[i].propertyDetails[0].city}</li>
                                <li className = "list-inline-item">{currentTrips[i].propertyDetails[0].state}</li>
                                <li className = "list-inline-item">{currentTrips[i].propertyDetails[0].country}</li>
                            </ul>
    
                            <ul className="list-inline" style={{paddingLeft: "10px"}}>
                                <li className = "list-inline-item"><i className="fas fa-home"></i></li>
                                <li className = "list-inline-item">{currentTrips[i].propertyDetails[0].propertyType}</li>
                                <li className = "list-inline-item"><i className="fas fa-bed"></i></li>
                                <li className = "list-inline-item"> {currentTrips[i].propertyDetails[0].bedrooms} BR</li>
                                <li className = "list-inline-item"><i className="fas fa-bath"></i></li>
                                <li className = "list-inline-item"> {currentTrips[i].propertyDetails[0].bathrooms} BA</li>
                                <li className = "list-inline-item"><i className="fas fa-user"></i></li>
                                <li className = "list-inline-item"> Sleeps {currentTrips[i].propertyDetails[0].sleeps}</li>
                                <li className = "list-inline-item"><i className="fa fa-calendar"></i></li>
                                <li className = "list-inline-item"> Min Stay {currentTrips[i].propertyDetails[0].minStay}</li>
                            </ul>
                            <br></br>
                            <br></br>
                            <span>
                                <strong style ={{fontSize: "16px", color: "#ff07ea", paddingLeft: "10px"}}><span> Staying from {moment(currentTrips[i].bookedFrom).utc().format('DD MMMM YYYY')} to {moment(currentTrips[i].bookedTo).utc().format('DD MMMM YYYY')} with {currentTrips[i].NoOfGuests - 1} more travelers.</span></strong>
                                <br></br>
                                <strong style ={{fontSize: "16px", color: "#ff07ea", paddingLeft: "10px"}}><span> You booked this Property for ${currentTrips[i].price + ' /night'}.</span></strong>
                            </span>
                        </div>      
                    </div>
                </div>
            });
        }
    }

    render(){
        
        const { currentPage, totalPages, allTrips, refreshTrips, detailsFetched} = this.state;
        const totalTrips = allTrips.length;

        console.log("detailsFetched:", detailsFetched);
        console.log("totalTrips:", totalTrips);

        let redirectVar = null;
        console.log(cookie.load('cookie1'))
        if(!cookie.load('cookie1') === 'travellercookie'){
            redirectVar = <Redirect to = "/"/>
        }

        return(
            <div>
                {redirectVar}
                <Navbar inverse collapseOnSelect>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a href="/" title = "HomeAway" className = "logo"><img alt="Homeaway Logo" src={require('./homeaway_logo.png')}/></a>
                        </Navbar.Brand>
                    </Navbar.Header>
                    <div>
                        <div className="btn btn-group" id="white">
                            <button className="dropdown-toggle" style = {{fontSize: "18px", background:"transparent", borderColor:"transparent"}} type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Hello {cookie.load('cookie3')}</button>
                            <div className="dropdown-menu">
                                <a className="dropdown-item" href="#"> <i className="fas fa-envelope"></i> Inbox</a>
                                <a className="dropdown-item" href="/traveller/mytrips"> <i className="fas fa-briefcase"></i> My Trips</a>
                                <a className="dropdown-item" href="/Profile"> <i className="fas fa-user"></i> My Profile</a>
                                <a className="dropdown-item" href="#" onClick= {this.logout}> <i className="fas fa-sign-out-alt"></i> Logout</a>
                            </div>
                        </div>
                        <img style={{marginLeft: "50px"}} src={require('./logo.png')} alt="Homeaway Logo"/>
                    </div>
                </Navbar>
                <div style={{backgroundColor: "white", borderLeftColor:"white",borderRightColor:"white",borderBottomColor: "#d6d7da", borderTopColor: "#d6d7da", borderStyle: "solid"}}>
                    <div id="conttab" className="container">
                        <ul id="ulinktab">
                            <li id="ulinktab" className="one"><a id="linktab" href="#"> <i className="fas fa-envelope"></i> Inbox</a></li>
                            <li id="ulinktab" className="two"><a id="linktab" href="/traveller/mytrips"> <i className="fas fa-briefcase"></i> My Trips</a></li>
                            <li id="ulinktab" className="three"><a id="linktab" href="/Profile"> <i className="fas fa-user"></i> My Profile</a></li>
                            <hr id="hrtab3" />
                        </ul>
                    </div>
                </div>
                <div className="container" style = {{}}>
                    <div className="row d-flex"style={{marginLeft: "200px", height: "70px", padding : "0px 0px 0px 0px"}}>
                        <div className="col-md-4 col-md-offset-3" style ={{marginLeft: "13px", marginTop: "15px"}}>
                            <div className="form-group">
                                <div className="input-group">
                                <span className="input-group-prepend">
                                    <div className="input-group-text form-control" ><i className="fas fa-heading"></i></div>
                                </span>
                                <input type="text" style ={{height: "50px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}} className="form-control" name="searchString" id="home" placeholder="Property Headline Search..." onChange = {this.changeHandler} value={this.state.searchString}/>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-offset-3" style ={{marginTop: "15px"}}>
                            <input placeholder="From" style ={{width: "180px", height: "50px"}} onChange = {this.changeHandler} value={this.state.fromdate} type="date" name="fromdate"/>  
                        </div>
                        <div className="col-md-offset-3" style = {{marginLeft: "13px", marginTop: "15px"}}>
                            <input placeholder="To" style ={{width: "160px", height: "50px"}} onChange = {this.changeHandler} value={this.state.todate} type="date" name="todate"/>  
                        </div>
                        <div className="col-md-offset-3" style = {{marginLeft: "13px", marginTop: "15px"}}>
                            <div className="form-group">
                                <button className="btn btn-primary" onClick = {this.searchProperty} style = {{ height: "50px", borderColor: "#ffffff", backgroundColor:"#0067db", width: "120px", borderRadius: 25}} data-effect="ripple" type="button" tabIndex="5" data-loading-animation="true">
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className = "container-full" >
                        <div className="container-pad">
                            <div className="container mb-3" style = {{marginBottom: "20px !important"}}>
                                <div className="row d-flex" style={{height: "70px", padding : "0px 0px 0px 0px"}}>
                                    <div className="w-100 px-4 py-5 d-flex flex-row flex-wrap align-items-center justify-content-between" style = {{paddingTop : "0px",}}>
                                    {detailsFetched &&
                                    (
                                        <div className="d-flex flex-row py-4 align-items-center" style={{marginLeft: "-20px"}}>
                                            <Pagination
                                                totalRecords={totalTrips}
                                                pageLimit={5}
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
                                <div className="form-row myformrow">
                                    <div className="form-group col-sm-9" id = "property-listings" style ={{maxWidth : "900px"}}>
                                        { this.renderTrips() }
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {!detailsFetched &&
                    (
                        <div className = "container-full">
                            <div className="container-pad" style={{textAlign: "center"}}>
                                <h1> No Trips Found! </h1>
                            </div>
                        </div>
                    )}
            </div>
        )
  }
}

function mapStateToProps(state) {
    return { travellertrips: state.travellertrips };
}

export default reduxForm({
    form: "TravellerTripsForm"
  })(connect(mapStateToProps, {travellertrips}) (TravellerTripListings) );