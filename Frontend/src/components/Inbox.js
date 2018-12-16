import React, {Component} from 'react';
import './OwnerPropertyListings.css';
import './Inbox.css'
import cookie from 'react-cookies';
import {Redirect, withRouter} from 'react-router-dom';
import {Navbar} from "react-bootstrap";
import Tabs from 'react-web-tabs/lib/Tabs';
import Tab from 'react-web-tabs/lib/Tab';
import TabPanel from 'react-web-tabs/lib/TabPanel';
import TabList from 'react-web-tabs/lib/TabList';
import { reduxForm } from "redux-form";
import { connect } from "react-redux";
import Popup from "reactjs-popup";
import {sendmail, getemails, getsentemails} from '../actions/inbox_actions';

const $ = window.$;

class Inbox extends Component {

    constructor(props){
        super(props);
        this.state = { 
          isTravelerlogin : false,
          alert: null, 
          sentemails : [{}],
          emails : [{}],
          currentEmailId : "",
          currentSentEmailId : "",
          open: false,
          mailReply : ""
        }
        this.logout = this.logout.bind(this);
        this.openEmail = this.openEmail.bind(this);
        this.openSentEmail = this.openSentEmail.bind(this);
        this.openPopup = this.openPopup.bind(this);
        this.closePopup = this.closePopup.bind(this);
        this.sendReply = this.sendReply.bind(this);
        this.changeMessageHandler = this.changeMessageHandler.bind(this);
    }

    openEmail(_id) {
        this.setState({
            currentEmailId: _id,
        });
    };
    
    openSentEmail(_id) {
        this.setState({
            currentSentEmailId: _id,
        });
    };
    
    changeMessageHandler = (event) => {
        this.setState ({
            mailReply : event.target.value
        })
    }
    
    openPopup = () => {
        this.setState({ open: true });
    };
      
    closePopup = () => {
        this.setState({ open: false });
    };

    hideAlert() {
        this.setState({
            alert: null
        });
    }

    logout = () => {
        // cookie.remove('cookie1', {path: '/'})
        // cookie.remove('cookie2', {path: '/'})
        // cookie.remove('cookie3', {path: '/'})
        sessionStorage.clear();
        console.log("All cookies removed!")
        window.location = "/"
    }

    sendReply = (email, mailReply) => {
        var data = {
            sender : sessionStorage.getItem('cookie3') + ' ' + sessionStorage.getItem('cookie4'),
            senderEmailAddress : sessionStorage.getItem('cookie2'),
            receiver : email.senderEmailAddress,
            _id : email._id,
            propertyID : email.propertyID,
            city : email.city,
            propertyHeadline : email.propertyHeadline,
            arrivalDate : email.arrivalDate,
            departDate : email.departDate,
            noOfGuests : email.noOfGuests,
            mailContent : email.mailContent + '\n\n' + 'Response :' + '\n\n' + mailReply,
            replied : false
        }

        console.log(data)
        this.props.sendmail(data, sessionStorage.getItem('jwtToken')).then(response => {
            console.log("Status Code for send mail: ",response.payload.status);
            if(response.payload.status === 200){
                console.log("Message successfully sent")
                var data = {emailID: sessionStorage.getItem('cookie2')};
                this.props.getsentemails(data, sessionStorage.getItem('jwtToken')).then(response => {
                    console.log("Status Code : ",response.payload.status);
                    if(response.payload.status === 200){
                        if(response.payload.data.length > 0){
                            this.setState ({
                                sentemails : response.payload.data,
                                isLoading : false,
                                issentboxempty : false,
                                currentSentEmailId :response.payload.data[0]._id
                            })
                            console.log("sent emails",this.state.sentemails)
                        }
                    }
                });
            }
        });
        this.setState({ open: false });
    }

    componentDidMount() {
        var emailfromcookie = sessionStorage.getItem('cookie2');
        var data = {emailID: emailfromcookie};
            
        this.props.getemails(data, sessionStorage.getItem('jwtToken')).then(response => {
            console.log("Status Code : ",response.payload.status);
            if(response.payload.status === 200){
                if(response.payload.data.length === 0){
                    this.setState ({
                        isLoading : false,
                    })
                } else {
                    this.setState ({
                        emails : response.payload.data,
                        isLoading : false,
                        currentEmailId :response.payload.data[0]._id
                    })
                }
            }
        });

        this.props.getsentemails(data, sessionStorage.getItem('jwtToken')).then(response => {
            console.log("Status Code : ",response.payload.status);
            if(response.payload.status === 200){
                if(response.payload.data.length === 0){
                    this.setState ({
                        isLoading : false,
                        issentboxempty : true
                    })
                    
                } else {
                    this.setState ({
                        sentemails : response.payload.data,
                        isLoading : false,
                        issentboxempty : false,
                        currentSentEmailId :response.payload.data[0]._id
                    })
                    console.log("sent emails",this.state.sentemails)
                }
            }
        });
    }

    render(){

        var currentEmailState = this.state.emails.find(x => x._id === this.state.currentEmailId);
        var currentSentEmailState = this.state.sentemails.find(x => x._id === this.state.currentSentEmailId);

        var travelername = null;
        /* redirect based on successful login */
        let redirectVar = null;
        if(!sessionStorage.getItem('cookie1')){
            redirectVar = <Redirect to= "/"/> 
        } else {
            this.state.isTravelerLoggedIn = true;
            travelername = cookie.load('travelername')
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
                    {(sessionStorage.getItem('cookie1') === 'travellercookie') 
                    ?
                    (
                    <div className="btn btn-group" id="white">
                        <button className="dropdown-toggle"  style = {{fontSize: "18px", backgroundColor:"transparent", background:"transparent", borderColor:"transparent"}} type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Hello {sessionStorage.getItem('cookie3')}</button>
                        <div className="dropdown-menu">
                            <a className="dropdown-item" href="/inbox"> <i className="fas fa-envelope"></i> Inbox</a>
                            <a className="dropdown-item" href="/traveller/mytrips"> <i className="fas fa-briefcase"></i> My Trips</a>
                            <a className="dropdown-item" href="/Profile"> <i className="fas fa-user"></i> My Profile</a>
                            <a className="dropdown-item"  onClick= {this.logout}> <i className="fas fa-sign-out-alt"></i> Logout</a>
                        </div>
                    </div>
                    )
                    :
                    (
                    <div className="btn btn-group" id="white">
                        <button className="dropdown-toggle"  style = {{fontSize: "18px", backgroundColor:"transparent", background:"transparent", borderColor:"transparent"}} type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Hello {sessionStorage.getItem('cookie3')}</button>
                        <div className="dropdown-menu">
                            <a className="dropdown-item" href="/inbox"> <i className="fas fa-envelope"></i> Inbox</a>
                            <a className="dropdown-item" href="/owner/mylistings"> <i className="fas fa-home"></i> My Listings</a>
                            <a className="dropdown-item" href="/owner/propertypost"> <i className="fas fa-building"></i> Post Property</a>
                            <a className="dropdown-item" href="/Profile"> <i className="fas fa-user"></i> My Profile</a>
                            <a className="dropdown-item" onClick = {this.logout}> <i className="fas fa-sign-out-alt"></i> Logout</a>
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
            {(sessionStorage.getItem('cookie1') === 'travellercookie') 
            ?
            (
                <div id="conttab" className="container">
                    <ul id="ulinktab">
                        <li id="ulinktab" className="one"><a id="linktab" > <i className="fas fa-envelope"></i> Inbox</a></li>
                        <li id="ulinktab" className="two"><a id="linktab" href="/traveller/mytrips"> <i className="fas fa-briefcase"></i> My Trips</a></li>
                        <li id="ulinktab" className="three"><a id="linktab" href="/Profile"> <i className="fas fa-user"></i> My Profile</a></li>
                        <hr id="hrtab4" />
                    </ul>
                </div>
            )
            :
            (
                <div id="conttab" className="container">
                    <ul id="ulinktab">
                        <li id="ulinktab" className="one"><a id="linktab" > <i className="fas fa-envelope"></i> Inbox</a></li>
                        <li id="ulinktab" className="two"><a id="linktab" href="/owner/mylistings"> <i className="fas fa-home"></i> My Listings</a></li>
                        <li id="ulinktab" className="three"><a id="linktab" href="/Profile"> <i className="fas fa-user"></i> My Profile</a></li>
                        <li id="ulinktab" className="four"><a id="linktab" href="/owner/propertypost"> <i className="fas fa-building"></i> Post Property</a></li>
                        <hr id="hrtab4" />
                    </ul>
                </div>
            )
            }
            </div>
            <div className = "container" id = "col" style ={{marginLeft : "10px", maxWidth : "1500px"}}>
                <Tabs defaultTab="inbox-tab1" vertical>
                    <div className= "row form-group">
                        <div className = "col-md-2">
                            <ul className="inbox-nav inbox-divider">
                                <TabList >
                                    <div className="row">
                                        <Tab tabFor="inbox-tab1" style={{backgroundColor: "rgb(142, 238, 233)"}} >
                                        <i className="fas fa-inbox-in"></i>
                                            <li><i className="fas fa-inbox"></i>&nbsp;&nbsp;Inbox</li>
                                        </Tab>
                                    </div>
                                    <div className="row">
                                        <Tab tabFor="inbox-tab2" style={{backgroundColor: "rgb(142, 238, 233)"}}>
                                            <li><i className="fas fa-external-link-alt"></i>&nbsp;&nbsp;Sent Mail</li>
                                        </Tab>
                                    </div>
                                </TabList>
                            </ul>
                        </div>
                        <div className= "col-md-10">
                            <TabPanel tabId="inbox-tab1">
                            <aside className="lg-side" style = {{marginTop : "10px"}}>
                                <div id = "tab1">
                                    <div className="inbox-head">
                                        <h3>Inbox</h3>
                                    </div>
                                    <div className="inbox-body">
                                        <div className="email-app__wrapper">
                                            <div className="row">
                                            <EmailList 
                                                emails={this.state.emails} 
                                                getSelectedEmail={this.openEmail} 
                                                selectedEmail={currentEmailState}
                                                fromInbox={true}
                                            />
                                            <EmailDetails 
                                                email={currentEmailState}
                                                open = {this.state.open}
                                                mailReply = {this.state.mailReply}
                                                openPopup = {this.openPopup}
                                                closePopup = {this.closePopup}
                                                changeMessageHandler = {this.changeMessageHandler}
                                                sendReply = {this.sendReply}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </aside>
                            </TabPanel>
                            <TabPanel tabId="inbox-tab2">
                                <aside className="lg-side" style = {{marginTop : "10px"}}>
                                    <div id = "tab2">
                                        <div className="inbox-head">
                                            <h3>Sent Mail</h3>
                                        </div> 
                                        <div className="inbox-body">
                                            <div className="email-app__wrapper">
                                                <div className="row">
                                                <EmailList 
                                                    emails={this.state.sentemails} 
                                                    getSelectedEmail={this.openSentEmail} 
                                                    selectedEmail={currentSentEmailState}
                                                    fromInbox={false}
                                                />
                                                <SentEmailDetails 
                                                    email={currentSentEmailState}
                                                />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </aside>
                            </TabPanel>
                        </div>
                    </div>
                </Tabs>
            </div>
        </div>
        )
    }
}

const EmailList = ({emails, getSelectedEmail, selectedEmail, fromInbox }) => {
    
   let emailList = emails.map(function(email, i) {    
            return <EmailListItem fromInbox={fromInbox} email={email} openEmail={getSelectedEmail} selected={selectedEmail === email}/>
    })
    return (
        <div className="email-list__wrapper col-md-4">
            <div className="email-list__container">
                {emailList}
            </div>
        </div>
    );
};

const prettyDate = (d) => {
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
    if(d !== undefined){
    var d = Number(d)
    var date = new Date(d).toISOString()
    let newdate = date.split("T")[0].split("-");
    let month = months[newdate[1] - 1];
    let day = newdate[2];
    let year = newdate[0];
    let time = date.split("T")[1].split(":");
    return month + " " + day + ", " + year + ' ' + time[0] + ':' + time[1] }
    else {
        return 0
    }
}

const EmailListItem = ({ email, openEmail, selected, fromInbox  }) => {

    var classes = "email-item";
    if(selected) {
        classes += " active";
    }

    console.log(classes);
    
    return (
       
        <div className={classes} onClick={() => openEmail(email._id)}>
            <div className="email-item__name">
                {!email.replied && fromInbox
                ? 
                    <div className ="dot">
                    </div> 
                : 
                (
                    null
                )}
                &nbsp;
                {email.sender}
            </div>
            <div className="email-item__time" >
                {prettyDate(email.timeReceived)}
            </div>
            <div className="email-item__subject" >
                <strong>{email.propertyHeadline}</strong>
            </div>
            <div className="email-item__message" style = {{textOverflow: "ellipsis", overflow: "hidden",whiteSpace: "nowrap"}}>
                {email.mailContent}
            </div>
        </div>
    );
};

const EmailDetails = ({ email, open , mailReply, openPopup, closePopup, changeMessageHandler, sendReply}) => {
    if(!email) {
        return (
            <div className="email-details__wrapper">
                <div className="empty-container">
                    <div className="empty-container__content">
                        {/* To not display the expanded email details div in case of no emails */}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="email-details__wrapper col-md-8" style={{background: "rgba(0, 123, 255, 0.09)",}}>
            <div className="email-details__container">
                <div className="email-details__header">
                    <a onClick={openPopup} style={{float: "right"}}><i className="fa fa-reply fa-3x"></i></a>
                    <div className="email-details__mark">
                        <Popup open ={open} closeOnDocumentClick onClose={closePopup}>
                            <div>
                            <   div className="popup1">
                                    <a className="close" onClick={closePopup}>&times;</a>
                                    <div className="header" style = {{marginTop : "30px"}}>
                                        <h2>Compose Message</h2>
                                    </div>
                                    <hr/>
                                    <div className="content">
                                        <div className="row">
                                            <div id="floatContainer1" className="col-md-3 float-container">
                                                <label>Arrive</label>
                                                <input id="shadownone" value = {email.arrivalDate} name="adate" readOnly type="text"/>
                                            </div>
                                            <div id="floatContainer1" className = "col-md-3 float-container" style = {{marginLeft: "10px"}}>
                                                <label>Depart</label>
                                                <input id="shadownone" value = {email.departDate} name="ddate" readOnly type="text"/>
                                            </div>
                                            <div id="floatContainer1" className="col-md-3 float-container" style = {{marginLeft: "10px", maxWidth: "180px"}}>
                                                <label>No. of Guests</label>
                                                <input id="shadownone" value = {email.noOfGuests} name="guests" readOnly type="text"/>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div id="floatContainer1" className="float-container">
                                                <label>Customer Name</label>
                                                <input id="shadownone" value ={email.sender} readOnly/>
                                            </div>
                                            <div id="floatContainer1" className="float-container">
                                                <label>Email Address</label>
                                                <input id="shadownone" value = {email.senderEmailAddress} name="email" readOnly type="text"/>
                                            </div>
                                            <textarea id="message" style={{width: "600px", marginLeft : "80px", }} value = {mailReply} onChange = {changeMessageHandler} cols="40" rows="5" placeholder="Message to Customer" className="form-control"></textarea>
                                        </div>
                                    </div>
                                    <button className="btn btn-primary" onClick={() => sendReply(email, mailReply)} style = {{ height: "60px", borderColor: "#ffffff", backgroundColor:"#0067db", width: "120px", borderRadius: 25}} data-effect="ripple" type="button" tabIndex="5" data-loading-animation="true">
                                        Send
                                    </button>
                                </div>
                            </div>
                        </Popup>
                    </div>
                    <div className="email-details__info">
                        <h5>{email.sender} {"<"}{email.senderEmailAddress}{">"}</h5>
                        <span className="pull-right">{prettyDate(email.timeReceived)}</span>
                    </div>
                    <div className="email-details__info">
                        <strong>Property Headline: {email.propertyHeadline}</strong>
                    </div>
                    <div className="email-details__info">
                        <strong>In {email.city}</strong>
                    </div>
                    <div className="email-details__info">
                        <strong>Check In&nbsp;&nbsp;: {email.arrivalDate}</strong>
                    </div>
                    <div className="email-details__info">
                        <strong>Check Out : {email.departDate}</strong>
                    </div>
                    <div className="email-details__info">
                        <strong>Guests : {email.noOfGuests}</strong>
                    </div>
                </div>
                <div className="email-details__message" style = {{whiteSpace : "pre-wrap"}}>
                    <h6 style = {{color :"#5e6d77", fontSize : "18px"}}>{email.mailContent}</h6>
                </div>
            </div>
        </div>
    )
}

const SentEmailDetails = ({email}) =>{
    if(!email) {
        return (
            <div className="email-details__wrapper">
                <div className="empty-container">
                    <div className="empty-container__content">
                    {/* To not display the expanded email details div in case of no emails */}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="email-details__wrapper col-md-8" style={{background: "rgba(0, 123, 255, 0.09)",}}>
            <div className="email-details__container">
                <div className="email-details__header">
                    <div className="email-details__info">
                        <h5>{email.sender} {"<"}{email.senderEmailAddress}{">"}</h5>
                        <span className="pull-right">{prettyDate(email.timeReceived)}</span>
                    </div>
                    <div className="email-details__info">
                        <strong>{email.propertyHeadline}</strong>
                    </div>
                    <div className="email-details__info">
                        <strong>{email.city}</strong>
                    </div>
                    <div className="email-details__info">
                        <strong>Check In&nbsp;&nbsp;: {email.arrivalDate}</strong>
                    </div>
                    <div className="email-details__info">
                        <strong>Check Out : {email.departDate}</strong>
                    </div>
                    <div className="email-details__info">
                        <strong>Guests : {email.noOfGuests}</strong>
                    </div>
                    <div className="email-details__buttons">
                        <div className="email-details__mark">
                        </div>
                    </div>
                </div>
                <div className="email-details__message" style = {{whiteSpace : "pre-wrap"}}>
                    <h6 style = {{color :"#5e6d77", fontSize : "18px"}}>{email.mailContent}</h6>
                </div>
            </div>
        </div>
    )
}

function mapStateToProps(state) {
    return { 
        getemails : state.getemails,
        replytoemail :state.replytoemail,
        getsentemails : state.getsentemails
    }
  }
  
  export default withRouter(reduxForm({
    form: "InboxForm"
  })(connect(mapStateToProps, {getemails, sendmail, getsentemails})(Inbox)));