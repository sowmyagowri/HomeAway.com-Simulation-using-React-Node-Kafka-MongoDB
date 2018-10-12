//index.js

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './components/Home';
import PropertySearchResults from './components/PropertySearchResults';
import PropertyDetails from './components/PropertyDetails';
import TravellerLogin from './components/TravellerLogin';
import TravellerTripListings from './components/TravellerTripListings';
import OwnerLogin from './components/OwnerLogin';
import OwnerPropertyPost from './components/OwnerPropertyPost';
import OwnerPropertyListings from './components/OwnerPropertyListings';
import Signup1 from './components/Signup1';
import Signup2 from './components/Signup2';
import OwnerSignup1 from './components/OwnerSignup1';
import OwnerSignup2 from './components/OwnerSignup2';

import Profile from './components/Profile';

import './index.css';


import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import RootReducer from "./reducers";
import promise from "redux-promise";
import { createLogger } from 'redux-logger';

//middleware settings
const loggerMiddleware = createLogger();
//createStoreWithMiddleware(RootReducer)
const store = createStore(RootReducer, applyMiddleware(promise,loggerMiddleware));

ReactDOM.render(
  
  <div className="container-fluid">
    <div>
      <Provider store={store}>
        <Router>
          <div>  
            <Route exact path='/' component={Home} />
            <Route path='/property/searchresult' render={(props)=> (
              <PropertySearchResults {...props} propDummy={50} />
            )} />
            <Route path='/property/:id/:location/:fromdate/:todate/:noOfGuests' component={PropertyDetails} />
            <Route path='/traveller/login' component={TravellerLogin} />
            <Route path='/traveller/signup1' component={Signup1} />
            <Route path='/traveller/signup2' component={Signup2} />
            <Route path='/traveller/mytrips' component={TravellerTripListings} />
            <Route path='/Profile' component={Profile} />
            <Route path='/owner/login' component={OwnerLogin} />
            <Route path='/owner/signup1' component={OwnerSignup1} />
            <Route path='/owner/signup2' component={OwnerSignup2} />
            <Route path='/owner/propertypost' component={OwnerPropertyPost} />
            <Route path='/owner/mylistings' component={OwnerPropertyListings} />
          </div>
        </Router>
      </Provider>
    </div>
  </div>
,
  document.getElementById('root')
);