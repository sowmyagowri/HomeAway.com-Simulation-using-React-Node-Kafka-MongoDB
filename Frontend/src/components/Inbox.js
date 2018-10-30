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
import {replytoemail, getemails, getsentemails} from '../actions/inbox_actions';

const $ = window.$;

class Inbox extends Component {

  constructor(props){
        super(props);
        this.state = { 
          isTravelerlogin : false, 
          isinboxempty : false, 
          alert: null, 
          sentemails : [{}],
          emails : [{}],
          currentEmailId : "",
          currentSentEmailId : "",
          open: false,
          mailreply : ""
        }
        this.logout = this.logout.bind(this);
        this.openEmail = this.openEmail.bind(this);
        this.openSentEmail = this.openSentEmail.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handlemessage = this.handlemessage.bind(this);
    }

    openEmail(Eid) {
        this.setState({
            currentEmailId: Eid,
        });
    };
    
    openSentEmail(Eid) {
        this.setState({
            currentSentEmailId: Eid,
        });
    };
    
    handlemessage = (event) => {
        this.setState ({
            mailreply : event.target.value
        })
    }
    
    openModal = () => {
        this.setState({ open: true });
    };
      
    closeModal = () => {
        this.setState({ open: false });
    };

    hideAlert() {
      console.log('Hiding alert...');
      this.setState({
        alert: null
      });
    }

    logout = () => {
        cookie.remove('cookie1', {path: '/'})
        cookie.remove('cookie2', {path: '/'})
        cookie.remove('cookie3', {path: '/'})
        console.log("All cookies removed!")
        window.location = "/"
      }

  componentDidMount() {
    var emailfromcookie = cookie.load('cookie2');
    var data = {emailID: emailfromcookie};
        
    this.props.getemails(data, sessionStorage.getItem('jwtToken')).then(response => {
        console.log("Status Code : ",response.payload.status);
        if(response.payload.status === 200){
            if(response.payload.data.length === 0){
                this.setState ({
                    isLoading : false,
                    isinboxempty : true
                })
            } else {
                this.setState ({
                    emails : response.payload.data,
                    isLoading : false,
                    isinboxempty : false,
                    currentEmailId :response.payload.data[0]._id
                })
                console.log(this.state.emails)
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
                    currentSentEmailId :response.payload.data[0].Eid
                })
                console.log(this.state.sentemails)
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
    if(!cookie.load('cookie1')){
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
                        {(cookie.load('cookie1') === 'travellercookie') 
                        ?
                        (
                        <div className="btn btn-group" id="white">
                            <button className="dropdown-toggle"  style = {{fontSize: "18px", backgroundColor:"transparent", background:"transparent", borderColor:"transparent"}} type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Hello {cookie.load('cookie3')}</button>
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
                            <button className="dropdown-toggle"  style = {{fontSize: "18px", backgroundColor:"transparent", background:"transparent", borderColor:"transparent"}} type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Hello {cookie.load('cookie3')}</button>
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
                {(cookie.load('cookie1') === 'travellercookie') 
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
                <Tabs defaultTab="vertical-tab-one" vertical>
                    <div className= "row form-group">
                        <div className = "col-md-2">
                            <ul className="inbox-nav inbox-divider">
                                <TabList >
                                    <div className="row">
                                        <Tab tabFor="vertical-tab-one">
                                        <i className="fas fa-inbox-in"></i>
                                            <li><i className="fas fa-inbox"></i>&nbsp;&nbsp;Inbox</li>
                                        </Tab>
                                    </div>
                                    <div className="row">
                                        <Tab tabFor="vertical-tab-two">
                                            <li><i className="fas fa-external-link-alt"></i>&nbsp;&nbsp;Sent Mail</li>
                                        </Tab>
                                    </div>
                                    <div className="row">
                                        <Tab tabFor="vertical-tab-three">
                                            <li><i className="far fa-trash-alt"></i>&nbsp;&nbsp;Trash</li>
                                        </Tab>
                                    </div>
                                </TabList>
                            </ul>
                        </div>
                        <div className= "col-md-10">
                            <TabPanel tabId="vertical-tab-one">
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
                                                selectedEmail={currentEmailState}/>
                                            <EmailDetails 
                                                email={currentEmailState}
                                                open = {this.state.open}
                                                mailreply = {this.state.mailreply}
                                                openModal = {this.openModal}
                                                closeModal = {this.closeModal}
                                                handlemessage = {this.handlemessage}
                                                handlesend = {(email, mailreply) => {
                                                    var data = {
                                                        sendername : cookie.load('cookie3') + ' ' + cookie.load('cookie4'),
                                                        senderemail : cookie.load('cookie2'),
                                                        receiver : email.Sender,
                                                        Eid : email.Eid,
                                                        propertyid : email.PropertyID,
                                                        propertylocated : email.City,
                                                        propertyheader : email.PropertyHeader,
                                                        checkin : email.Arrivaldate,
                                                        checkout : email.Departdate,
                                                        guests : email.Guests,
                                                        mailcontent : email.MailContent + '\n\n' + 'Response :' + '\n\n' + mailreply,
                                                        reply : false
                                                    }
                                            
                                                    console.log(data)
                                                    this.props.replytoemail(data, sessionStorage.getItem('jwtToken')).then(response => {
                                                        if(response.payload.status === 200){
                                                            console.log("Message successfully sent")
                                                        }
                                                    });
                                                    this.setState({ open: false });
                                                    
                                                }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </aside>
                            </TabPanel>
                            <TabPanel tabId="vertical-tab-two">
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
                                                selectedEmail={currentSentEmailState}/>
                                            <SentEmailDetails 
                                                email={currentSentEmailState} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </aside>
                            </TabPanel>
                            <TabPanel tabId="vertical-tab-three">
                            <aside className="lg-side" style = {{marginTop : "10px"}}>
                                <div id = "tab3">
                                    <div className="inbox-head">
                                        <h3>Trash</h3>
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


const Compose = ({closeCompose, sendMessage }) => {
    return (
        <div className="compose-email__wrapper">
            <div className="compose-email__content">
                <div className="compose-email__message">
                    <div className="compose-email__header" onClick={() => closeCompose()}>
                        New Message
                        <span  className="white pull-right">
                        <i className="fa fa-times" aria-hidden="true"></i>
                        </span>
                    </div>
                
                    <div className="compose-email__body">
                        <div className="compose-email__toemail">
                        <input placeholder="To:"/>
                        </div>
                        <div className="compose-email__subject">
                        <input placeholder="Subject:"/>
                        </div>
                        <div className="compose-email__message-content">
                        <textarea rows="6" placeholder="Type Your Message Here"></textarea>
                        </div>
                    </div>
                    <div className="compose-email__footer">
                        <button>Send</button>
                    </div>
                </div>
            </div>
        </div>
    )
};

const EmailList = ({emails, getSelectedEmail, selectedEmail }) => {
    let emailList = emails.map(function(email, i) {    
        return <EmailListItem email={email} openEmail={getSelectedEmail} selected={selectedEmail === email}/>
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
    // console.log(month + " " + day + ", " + year + ' ' + time[0] + ':' + time[1])
    return month + " " + day + ", " + year + ' ' + time[0] + ':' + time[1] }
    else {
        return 0
    }
}

const EmailListItem = ({ email, openEmail, selected  }) => {
    var classes = "email-item";
    if(selected) {
        classes += " active unread";
    }
        
    return (
        <div className={classes} onClick={() => openEmail(email.Eid)}>
            <div className="email-item__name">{!email.Replied ? <div className ="dot"></div> : (null)}&nbsp;&nbsp;{email.Sender}</div>
            <div className="email-item__subject" >
            <strong>{email.Header}</strong>
            </div>
            <div className="email-item__time">{prettyDate(email.TimeReceived)}</div> 
            <div className="email-item__message" style = {{textOverflow: "ellipsis", overflow: "hidden",
whiteSpace: "nowrap"}}>{email.MailContent}</div>
        </div>  
    );
};


const SentEmailDetails = ({email}) =>{
    if(!email) {
        return (
            <div className="email-details__wrapper">
                <div className="empty-container">
                    <div className="empty-container__content">
                        
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="email-details__wrapper col-md-8">
            <div className="email-details__container">
                <div className="email-details__header">
                <div className="email-details__info">
                    <h5>{email.Sender} {"<"}{email.SenderEmailAddress}{">"}</h5>
                    <span className="pull-right">{prettyDate(email.TimeReceived)}</span>
                </div>
                <div className="email-details__info">
                    <strong>{email.PropertyHeader}</strong></div>
                <div className="email-details__info">
                    <strong>{email.City}</strong></div>
                <div className="email-details__info">
                    <strong>Check In&nbsp;&nbsp;: {email.Arrivaldate}</strong></div>
                <div className="email-details__info">
                    <strong>Check Out : {email.Departdate}</strong></div>
                <div className="email-details__info">
                    <strong>Guests : {email.Guests}</strong>
                </div>
                <div className="email-details__buttons">
                    <div className="email-details__mark">
                    </div>
                </div>
                <div className="email-details__message" style = {{whiteSpace : "pre-wrap"}}>
                    <h6 style = {{color :"#5e6d77", fontSize : "18px"}}>{email.MailContent}</h6>
                </div>
            </div>
            </div>
        </div>
    )
}

const EmailDetails = ({ email, open , mailreply, openModal, closeModal, handlemessage, handlesend}) => {
    if(!email) {
        return (
            <div className="email-details__wrapper">
                <div className="empty-container">
                    <div className="empty-container__content">
                        
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="email-details__wrapper col-md-8">
            <div className="email-details__container">
                <div className="email-details__header">
                <div className="email-details__info">
                    <h5>{email.Sender} {"<"}{email.SenderEmailAddress}{">"}</h5>
                    <span className="pull-right">{prettyDate(email.TimeReceived)}</span>
                </div>
                <div className="email-details__info">
                    <strong>PropertyID #{email.PropertyID}&nbsp;{email.PropertyHeader}</strong></div>
                <div className="email-details__info">
                    <strong>{email.City}</strong></div>
                <div className="email-details__info">
                    <strong>Check In&nbsp;&nbsp;: {email.Arrivaldate}</strong></div>
                <div className="email-details__info">
                    <strong>Check Out : {email.Departdate}</strong></div>
                <div className="email-details__info">
                    <strong>Guests : {email.Guests}</strong>
                </div>
                <div className="email-details__buttons">
                    <div className="email-details__mark">
                    <button className="btn" onClick={openModal}><span ><i className="fa fa-envelope-o markUnread"></i></span></button>
                    <Popup open ={open} closeOnDocumentClick onClose={closeModal}>
                                        <div>
                                                <div className="modal1">
                                                <a className="close" onClick={closeModal}>
                                                    &times;
                                                    </a>
                                                        <div className="header" style = {{marginTop : "30px"}}><h2>Compose Message</h2></div>
                                                        <hr/>
                                                            <div className="content">
                                                            <div className="row">
                                                            <div id="floatContainer3" className="float-container">
                                                                <label htmlFor="floatField3">Email Address</label>
                                                                <input type = 'text' value ={email.SenderEmailAddress} readOnly/>
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                            <div className="col-md-3"  style = {{marginLeft: "8%"}}>
                                                                <div className="form-group card" style = {{ backgroundColor: "#f6f7f8", height: "60px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}}>
                                                                <small style = {{marginLeft : "5px", fontSize : "15px" , marginRight : "5px"}}>Arrive</small>
                                                                <input type = 'text' value ={email.Arrivaldate} style = {{backgroundColor: "#f6f7f8", border : "none", marginTop : "16px"}}  readOnly/>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-3" style = {{marginLeft: "13px"}}>
                                                                <div className="form-group card" style = {{backgroundColor: "#f6f7f8", height: "60px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}}>
                                                                <small style = {{marginLeft : "5px", fontSize : "15px" , marginRight : "5px"}}>Depart</small>
                                                                <input type = 'text' value ={email.Departdate}  style = {{ marginLeft : "25px", backgroundColor: "#f6f7f8", border : "none", marginTop : "16px"}}  readOnly/>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-3" style = {{marginLeft: "13px"}}>
                                                                <div className="form-group card" style = {{backgroundColor: "#f6f7f8", width : "180px", height: "60px", fontFamily: "Lato,Roboto,Arial,Helvetica Neue,Helvetica,sans-serif"}}>
                                                                <small style = {{marginLeft : "5px", fontSize : "15px" , marginRight : "5px"}}>Guests</small>
                                                                <input type = 'text'  value ={email.Guests}  style = {{ marginLeft : "25px", backgroundColor: "#f6f7f8", border : "none", marginTop : "16px"}}  readOnly/>
                                                                </div>
                                                            </div>
                                                            </div>
                                                            <div className="row">
                                                                <div id="floatContainer5" className="float-container">
                                                                    <label htmlFor="floatField5">Customer Name</label>
                                                                    <input type = 'text' value ={email.Sender} readOnly/>

                                                                </div>
                                                                <div className="float-container1">
                                                                    <textarea id="message" readOnly value = {email.MailContent} name="aboutme" cols="40" rows="4" placeholder="Message from Customer" className="form-control"></textarea>
                                                                </div>

                                                                <div className="float-container1">
                                                                    <textarea id="message" value = {mailreply} onChange = {handlemessage} cols="40" rows="10" placeholder="Message to Customer" className="form-control"></textarea>
                                                                </div>
                                                                </div>

                                                                </div>
                                                        </div>
                                                        <div className="actions">
                                            <button
                                                className="btn btn-primary btn2"
                                                style = {{ height: "60px", borderColor: "#ffffff", backgroundColor:"#0067db", borderRadius: 30}} 
                                                data-effect="ripple" 
                                                type="button" 
                                                tabIndex="5" 
                                                data-loading-animation="true"
                                                onClick={() => handlesend(email, mailreply)}>
                                                Send
                                            </button>
                                            </div>
                                            </div>
                                        
                                    </Popup>
                    </div>
                </div>
                </div>
                <div className="email-details__message" style = {{whiteSpace : "pre-wrap"}}>
                    <h6 style = {{color :"#5e6d77", fontSize : "18px"}}>{email.MailContent}</h6>
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
  })(connect(mapStateToProps, {getemails, replytoemail, getsentemails})(Inbox)));