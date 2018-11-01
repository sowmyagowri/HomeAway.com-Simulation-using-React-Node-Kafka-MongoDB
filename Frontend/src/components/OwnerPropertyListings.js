import React, {Component} from 'react';
import 'typeface-roboto'
import './OwnerPropertyListings.css';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import {Navbar} from "react-bootstrap";
import moment from 'moment';

import { propertylisting } from '../actions';
import { reduxForm } from "redux-form";
import { connect } from 'react-redux';

import Pagination from "./Pagination";

class OwnerPropertyListings extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            email: "",
            isLoading : true,
            allListings:[{}],
            currentListings:[{}],
            detailsFetched:false,
            currentPage: null,
            totalPages: null,
            refreshListings : false,
            searchString: null,
            fromdate: null,
            todate: null,
        };
        
        this.renderListings = this.renderListings.bind(this);
        this.logout = this.logout.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.handleValidation = this.handleValidation.bind(this);
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

    handleValidation(){

        console.log("in handle")
        let formIsValid = true;
        
        if(!this.state.fromdate && !this.state.todate){
            return formIsValid;
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

            if (GiventoDate <= GivenfromDate){
                alert('To date should be greater than from date.');
                formIsValid = false;
            }
        }
        return formIsValid;
    }

    searchProperty = () => {

        console.log("in search property");
        this.setState({
            detailsFetched: false,
        });

        if(this.handleValidation()){
            const requestData = { 
                listedBy : cookie.load('cookie2'),
                currentPage: 1, 
                pageLimit: 0,
                fromdate: this.state.fromdate,
                todate: this.state.todate,
            }

            this.props.propertylisting(requestData, sessionStorage.getItem('jwtToken'))
            .then(response => {
                if(response.payload.status === 200){
                    if (response.payload.data.length > 0){
                        if(this.state.searchString === "" || this.state.searchString === null){
                            const allListings = response.payload.data;
                            this.setState({
                                allListings,
                                detailsFetched: true,
                                refreshListings: true,
                            });
                        } else {
                            var text = this.state.searchString.toLowerCase();
                            const allListings = response.payload.data;
                            let searchedListings1 = allListings.filter((row) => {
                                return row.headline.toLowerCase().includes(text);
                            });
                            if (searchedListings1.length > 0) {
                                this.setState ({
                                    allListings : searchedListings1,
                                    detailsFetched: true,
                                    refreshListings: true,
                                })
                            } else {
                                this.setState ({
                                    detailsFetched: false,
                                    refreshListings: false,
                                })
                            }
                        }
                    } else {
                        const allListings = response.payload.data;
                        this.setState({
                            allListings,
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

    onPageChanged = data => {

        console.log("page changes")
        const { currentPage, totalPages, pageLimit } = data;
        const requestDataPageChange = { 
           listedBy : cookie.load('cookie2'),
           currentPage: currentPage, 
           pageLimit: pageLimit,
           fromdate: this.state.fromdate,
           todate: this.state.todate,
        }

        this.props.propertylisting(requestDataPageChange, sessionStorage.getItem('jwtToken'))
            .then(response => {
                console.log("Status Code : ", response.payload.status);
                if(response.payload.status === 200){
                    if(this.state.searchString === "" || this.state.searchString === null){
                        this.setState({
                            currentListings : response.payload.data,
                            isLoading : false,
                            refreshListings: false,
                        });
                        this.setState({ currentPage, totalPages });
                    } else {
                        var text = this.state.searchString.toLowerCase();
                        const currentListings = response.payload.data;
                        let searchedListings2 = currentListings.filter((row) => {
                            return row.headline.toLowerCase().includes(text);
                        });
                        this.setState ({
                            currentListings : searchedListings2,
                            isLoading : false,
                            refreshListings: false,
                        })
                        this.setState({ currentPage, totalPages });
                    }
                }
        });
    }
    
    componentWillMount(){
        
        const requestData = { 
            listedBy : cookie.load('cookie2'),
            currentPage: 1, 
            pageLimit: 0,
            fromdate: this.state.fromdate,
            todate: this.state.todate,
        }
        
        this.props.propertylisting(requestData, sessionStorage.getItem('jwtToken'))
        .then(response => {
            console.log("Status Code in Will Mount: ", response.payload.status);
            if(response.payload.status === 200){
                console.log(response.payload.data)
                const allListings = response.payload.data;
                console.log(allListings);
                this.setState({
                    allListings,
                    detailsFetched: true
                });
            }
        })
        .catch (error => {
            console.log(error);
        });
    }

    renderListings () {
        const {currentListings} = this.state;
        const {isLoading} = this.state;

        if(!isLoading){
            console.log("generating property cards...")
            return Object.keys(currentListings).map((i) => {
                    return <div className="brdr bgc-fff pad-10 box-shad btm-mrg-20 myborder1 property-listing" key={currentListings[i].ID}>
                    <div className="media">
                        <a className="pull-left"  target="_parent">
                        <img alt="Thumbnail View of Property" className="img-responsive" src={`http://localhost:3001/uploads/${currentListings[i].image1}`} /></a>
                        <div className="media-body">  
                            <h4 className="myh4" style={{paddingLeft: "10px"}}>{currentListings[i].headline}</h4>
                           
                            <h6 className="myh6" style={{paddingLeft: "10px", justifyContent: "true"}}>{currentListings[i].description}</h6>
  
                            <ul className="list-inline" style={{paddingLeft: "10px"}}>
                                <li className = "list-inline-item"><img alt="Pindrop Sign" style={{height: "35px"}} src={require('./pindrop.png')}/></li>
                                <li className = "list-inline-item">{currentListings[i].streetAddress}</li>
                                <li className = "list-inline-item">{currentListings[i].city}</li>
                                <li className = "list-inline-item">{currentListings[i].state}</li>
                                <li className = "list-inline-item">{currentListings[i].country}</li>
                            </ul>
    
                            <ul className="list-inline" style={{paddingLeft: "10px"}}>
                                <li className = "list-inline-item"><i className="fas fa-home"></i></li>
                                <li className = "list-inline-item">{currentListings[i].propertyType}</li>
                                <li className = "list-inline-item"><i className="fas fa-bed"></i></li>
                                <li className = "list-inline-item"> {currentListings[i].bedrooms} BR</li>
                                <li className = "list-inline-item"><i className="fas fa-bath"></i></li>
                                <li className = "list-inline-item"> {currentListings[i].bathrooms} BA</li>
                                <li className = "list-inline-item"> <i className="fas fa-user"></i></li>
                                <li className = "list-inline-item"> Sleeps {currentListings[i].sleeps}</li>
                                <li className = "list-inline-item"><i className="fa fa-calendar"></i></li>
                                <li className = "list-inline-item"> Min Stay {currentListings[i].minStay}</li>
                            </ul>
    
                            <span>
                                <strong style ={{fontSize: "20px", paddingLeft: "10px"}}><span>{currentListings[i].currency + ' ' + currentListings[i].baseRate + ' /night'}</span></strong>
                            </span>
                            <br></br>
                            <br></br>
                            <span>
                                <strong style ={{fontSize: "16px", color: "#ff07ea", paddingLeft: "10px"}}><span> Listed From {moment(currentListings[i].startDate).utc().format('DD MMMM YYYY')} To {moment(currentListings[i].endDate).utc().format('DD MMMM YYYY')}</span></strong>
                            </span>

                            <br></br><br></br><br></br>
                            {currentListings[i].bookedBy.length > 0
                                ?
                                (   
                                    <div>
                                        <table className="table table-striped" id="bookings">
                                            <thead>
                                                <tr>
                                                    <th>Booked By</th>
                                                    <th>From</th>
                                                    <th>To</th>
                                                    <th>No. Of Guests</th>
                                                    <th>Price</th>
                                                </tr>
                                            </thead>
                                            { this.renderbookingTable(currentListings[i]) }
                                        </table>
                                    </div>
                                )
                                :
                                (
                                    <div className = "container-full">
                                        <h2> No Booking History! </h2>
                                    </div>
                                )
                            }
                        </div>      
                    </div>
                </div>
            });
        }
    }

    renderbookingTable (listingData) {
        const {isLoading} = this.state;
        if(!isLoading){
            console.log("generating table content...")
            return Object.keys(listingData.bookedBy).map( (j) => {
                return <tbody data-ng-repeat="bookingData in listingData[i]">
                            <tr>
                                <td>{listingData.bookedBy[j]}</td>
                                <td>{moment(listingData.bookedFrom[j]).utc().format('DD MMMM YYYY')}</td>
                                <td>{moment(listingData.bookedTo[j]).utc().format('DD MMMM YYYY')}</td>
                                <td>{listingData.noOfGuests[j]}</td>
                                <td>$ {listingData.price[j]}</td>
                            </tr>
                        </tbody>
            });
        }
    }

    render(){
        
        const { currentPage, totalPages, allListings, refreshListings} = this.state;
        console.log("allListings:", allListings);
        const totalListings = allListings.length;
        console.log("render", totalListings);
        let redirectVar = null;
        console.log(cookie.load('cookie1'))
        if(cookie.load('cookie1') !== 'ownercookie'){
          redirectVar = <Redirect to = "/owner/login"/>
        }

        return(
            <div>
            {redirectVar}
                <Navbar inverse collapseOnSelect>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a  title = "HomeAway" className = "logo"><img alt="Homeaway Logo" src={require('./homeaway_logo.png')}/></a>
                        </Navbar.Brand>
                    </Navbar.Header>
                    <div>
                        <div id="white" className="btn btn-group">
                            <button className="dropdown-toggle"  style = {{fontSize: "18px",backgroundColor:"transparent", background:"transparent", borderColor:"transparent"}} type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Hello {cookie.load('cookie3')}</button>
                            <div className="dropdown-menu">
                                <a className="dropdown-item" href="/inbox"> <i className="fas fa-envelope"></i> Inbox</a>
                                <a className="dropdown-item" href="/owner/mylistings"> <i className="fas fa-home"></i> My Listings</a>
                                <a className="dropdown-item" href="/owner/propertypost"> <i className="fas fa-building"></i> Post Property</a>
                                <a className="dropdown-item" href="/Profile"> <i className="fas fa-user"></i> My Profile</a>
                                <a className="dropdown-item" onClick = {this.logout}> <i className="fas fa-sign-out-alt"></i> Logout</a>
                            </div>
                        </div>
                        <img style={{marginLeft: "50px"}} src={require('./logo.png')} alt="Homeaway Logo"/>
                    </div>
                </Navbar>
                <div style={{backgroundColor: "white", borderLeftColor:"white",borderRightColor:"white",borderBottomColor: "#d6d7da", borderTopColor: "#d6d7da", borderStyle: "solid"}}>
                    <div id="conttab" className="container">
                        <ul id="ulinktab">
                            <li id="ulinktab" className="one"><a id="linktab" href="/inbox"> <i className="fas fa-envelope"></i> Inbox</a></li>
                            <li id="ulinktab" className="two"><a id="linktab" href="/owner/mylistings"> <i className="fas fa-home"></i> My Listings</a></li>
                            <li id="ulinktab" className="three"><a id="linktab" href="/Profile"> <i className="fas fa-user"></i> My Profile</a></li>
                            <li id="ulinktab" className="four"><a id="linktab" href="/owner/propertypost"> <i className="fas fa-building"></i> Post Property</a></li>
                            <hr id="hrtab1" />
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
                                <div className="row d-flex"style={{height: "70px", padding : "0px 0px 0px 0px"}}>
                                    <div className="w-100 px-4 py-5 d-flex flex-row flex-wrap align-items-center justify-content-between" style = {{paddingTop : "0px",}}>
                                    {this.state.detailsFetched &&
                                    (
                                        <div className="d-flex flex-row align-items-center" style={{marginLeft: "-20px"}}>
                                            <Pagination
                                                totalRecords={totalListings}
                                                pageLimit={5}
                                                pageNeighbours={1}
                                                onPageChanged={this.onPageChanged}
                                                refresh={refreshListings}
                                            />
                                        </div>
                                    )
                                    }
                                    {this.state.detailsFetched &&
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
                            {this.state.detailsFetched &&
                            (
                                <div className="form-row myformrow">
                                    <div className="form-group col-sm-9" id = "property-listings" style ={{maxWidth : "900px"}}>
                                        { this.renderListings() }
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {!this.state.detailsFetched &&
                    (
                        <div className = "container-full">
                            <div className="container-pad">
                                <h1> You have not listed any Property! </h1>
                            </div>
                        </div>
                    )}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return { propertylisting: state.propertylisting };
  }
  
  export default reduxForm({
    form: "OwnerPropertyListForm"
  })(connect(mapStateToProps, {propertylisting}) (OwnerPropertyListings) );