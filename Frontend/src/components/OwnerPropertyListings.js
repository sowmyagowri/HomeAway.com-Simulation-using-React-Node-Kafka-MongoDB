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
            authFlag: false,
            currentPage: null,
            totalPages: null,
        };
        
        this.renderListings = this.renderListings.bind(this);
        this.logout = this.logout.bind(this);
    }

    logout = () => {
        cookie.remove('cookie1', {path: '/'})
        cookie.remove('cookie2', {path: '/'})
        cookie.remove('cookie3', {path: '/'})
        console.log("All cookies removed!")
        window.location = "/"
    }

    onPageChanged = data => {
        const { currentPage, totalPages, pageLimit } = data;
        const requestDataPageChange = { 
           listedBy : cookie.load('cookie2'),
           currentPage: currentPage, 
           pageLimit: pageLimit,
        }

        this.props.propertylisting(requestDataPageChange, sessionStorage.getItem('jwtToken'))
            .then(response => {
                console.log("Status Code : ", response.payload.status);
                if(response.payload.status === 200){
                    this.setState({
                        currentListings : response.payload.data,
                        isLoading : false
                    });
                    this.setState({ currentPage, totalPages });
                }
        });
    }
    
    componentWillMount(){
        
        const requestData = { 
            listedBy : cookie.load('cookie2'),
            currentPage: 1, 
            pageLimit: 0,
        }
        
        this.props.propertylisting(requestData, sessionStorage.getItem('jwtToken'))
        .then(response => {
            console.log("Status Code in Will Mount: ", response.payload.status);
            if(response.payload.status === 200){
                console.log(response.payload.data)
                const allListings = response.payload.data;
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

        console.log(this.state.currentListings);
        if(!isLoading){
            console.log("generating content...")
            return Object.keys(currentListings).map((i) => {
                    return <div className="brdr bgc-fff pad-10 box-shad btm-mrg-20 myborder1 property-listing" key={currentListings[i].ID}>
                    <div className="media">
                        <a className="pull-left" href="#" target="_parent">
                        <img alt="Thumbnail View of Property" className="img-responsive" src={`http://localhost:3001/uploads/${currentListings[i].image1}`} /></a>
                        <div className="media-body">  
                            <h4 className="myh4">{currentListings[i].headline}</h4>
                            <h6 className="myh6">{currentListings[i].description}</h6>
  
                            <ul className="list-inline">
                                <li className = "list-inline-item"><img alt="Pindrop Sign" style={{height: "35px"}} src={require('./pindrop.png')}/></li>
                                <li className = "list-inline-item">{currentListings[i].streetAddress}</li>
                                <li className = "list-inline-item">{currentListings[i].city}</li>
                                <li className = "list-inline-item">{currentListings[i].state}</li>
                                <li className = "list-inline-item">{currentListings[i].country}</li>
                            </ul>
    
                            <ul className="list-inline">
                                <li className = "list-inline-item">{currentListings[i].propertyType}</li>
                                <li className = "list-inline-item dot"> </li>
                                <li className = "list-inline-item"> {currentListings[i].bedrooms} BR</li>
                                <li className = "list-inline-item dot"> </li>
                                <li className = "list-inline-item"> {currentListings[i].bathrooms} BA</li>
                                <li className = "list-inline-item dot"></li>
                                <li className = "list-inline-item"> Sleeps {currentListings[i].sleeps}</li>
                                <li className = "list-inline-item dot"></li>
                                <li className = "list-inline-item"> Min Stay {currentListings[i].minStay}</li>
                            </ul>
    
                            <span>
                                <strong style ={{fontSize: "20px"}}><span>${currentListings[i].currency + ' ' + currentListings[i].baseRate + ' /night'}</span></strong>
                            </span>
                            <br></br>
                            <br></br>
                            <span>
                                <strong style ={{fontSize: "16px"}}><span> Listed From {moment(currentListings[i].startDate).format('MM-DD-YYYY')} To {moment(currentListings[i].endDate).format('MM-DD-YYYY')}</span></strong>
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
                                <td>{listingData.bookedFrom[j]}</td>
                                <td>{listingData.bookedTo[j]}</td>
                                <td>{listingData.noOfGuests[j]}</td>
                                <td>$ {listingData.price[j]}</td>
                            </tr>
                        </tbody>
            });
        }
    }

    render(){
        
        const { currentPage, totalPages, allListings} = this.state;
        const totalListings = allListings.length;

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
                        <a href="#" title = "HomeAway" className = "logo"><img alt="Homeaway Logo" src={require('./homeaway_logo.png')}/></a>
                        </Navbar.Brand>
                    </Navbar.Header>
                    <div>
                    <div id="white" className="btn btn-group">
                        <button className="dropdown-toggle"  style = {{fontSize: "18px",backgroundColor:"transparent", background:"transparent", borderColor:"transparent"}} type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Hello {cookie.load('cookie3')}</button>
                        <div className="dropdown-menu">
                            <a className="dropdown-item" href="#"> <i className="fas fa-envelope"></i> Inbox</a>
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
                            <li id="ulinktab" className="one"><a id="linktab" href="#"> <i className="fas fa-envelope"></i> Inbox</a></li>
                            <li id="ulinktab" className="two"><a id="linktab" href="/owner/mylistings"> <i className="fas fa-home"></i> My Listings</a></li>
                            <li id="ulinktab" className="three"><a id="linktab" href="/Profile"> <i className="fas fa-user"></i> My Profile</a></li>
                            <li id="ulinktab" className="four"><a id="linktab" href="/owner/propertypost"> <i className="fas fa-building"></i> Post Property</a></li>
                            <hr id="hrtab1" />
                        </ul>
                    </div>
                </div>
                {this.state.detailsFetched 
                ?
                (   
                    <div className = "container-full">
                        <div className="container-pad">
                            <div className="container mb-5">
                                <div className="row d-flex flex-row py-5"style={{height: "140px",}}>
                                    <div className="w-100 px-4 py-5 d-flex flex-row flex-wrap align-items-center justify-content-between">
                                        <div className="d-flex flex-row py-4 align-items-center">
                                            <div className="d-flex flex-row py-4 align-items-center">
                                                <Pagination
                                                    totalRecords={totalListings}
                                                    pageLimit={5}
                                                    pageNeighbours={1}
                                                    onPageChanged={this.onPageChanged}
                                                />
                                            </div>
                                        </div>
                                        <div className="d-flex flex-row align-items-center">
                                            {currentPage && (
                                                <span className="current-page d-inline-block h-100 pl-4 text-secondary" style={{fontSize: "17px",}}>
                                                Page <span className="font-weight-bold">{currentPage}</span> /{" "}
                                                <span className="font-weight-bold">{totalPages}</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-row myformrow">
                                <div className="form-group col-sm-9" id = "property-listings" style ={{maxWidth : "900px"}}>
                                    { this.renderListings() }
                                </div>
                            </div>
                        </div>
                    </div>
                )
                :
                (
                    <div className = "container-full">
                        <div className="container-pad">
                            <h1> You have not listed any Property! </h1>
                        </div>
                    </div>
                )
                }
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