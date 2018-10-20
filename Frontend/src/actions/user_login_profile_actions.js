import axios from "axios";
import { userConstants } from '../constants';

//target action for traveller login
export function travellerlogin(data, tokenFromStorage) {
  console.log("inside traveller login action")
  console.log(data)
  console.log("tokenFromStorage", tokenFromStorage)
  var config = {
    headers: {'Authorization': tokenFromStorage,
              'Content-Type': 'application/json'
    }
  };
  axios.defaults.withCredentials = true;
  const response =  axios.post('http://localhost:3001/homeaway/traveller/login',data, config);
  console.log("Response", response);
  return {
    type: userConstants.TRAVELLER_LOGIN,
    payload: response
  };  
}

//target action for traveller signup
export function travellersignup(data) {
  console.log("inside traveller signup action")
  console.log(data)
  axios.defaults.withCredentials = true;
  const response =  axios.post('http://localhost:3001/homeaway/traveller/signup',data);
  console.log("Response", response);
  return {
    type: userConstants.TRAVELLER_SIGNUP,
    payload: response
  };  
}

//target action for owner login
export function ownerlogin(data, tokenFromStorage) {
  console.log("inside owner login action")
  console.log(data)
  console.log("tokenFromStorage", tokenFromStorage)
  var config = {
    headers: {'Authorization': tokenFromStorage,
              'Content-Type': 'application/json'
    }
  };
  axios.defaults.withCredentials = true;
  const response =  axios.post('http://localhost:3001/homeaway/owner/login',data, config);
  console.log("Response", response);
  return {
    type: userConstants.OWNER_LOGIN,
    payload: response
  };  
}

//target action for owner signup
export function ownersignup(data) {
  console.log("inside owner signup action")
  console.log(data)
  axios.defaults.withCredentials = true;
  const response =  axios.post('http://localhost:3001/homeaway/owner/signup',data);
  console.log("Response", response);
  return {
    type: userConstants.OWNER_SIGNUP,
    payload: response
  };  
}

//target action for profile fetch
export function profilefetch(data, tokenFromStorage) {
  console.log("inside profile fetch action")
  console.log(data)
  console.log("tokenFromStorage", tokenFromStorage)
  var config = {
    headers: {'Authorization': tokenFromStorage,
              'Content-Type': 'application/json'
    }
  };
  axios.defaults.withCredentials = true;
  console.log("headers:", config);
  const response =  axios.post('http://localhost:3001/homeaway/profile', data, config);
  console.log("Response", response);
  return {
    type: userConstants.PROFILE_FETCH,
    payload: response
  };  
}

//target action for profile save
export function profilesave(data, tokenFromStorage) {
  console.log("inside profile save action")
  console.log(data)
  var config = {
    headers: {'Authorization': tokenFromStorage,
              'Content-Type': 'application/json'
    }
  };
  axios.defaults.withCredentials = true;
  const response =  axios.post('http://localhost:3001/homeaway/profilesave', data, config);
  console.log("Response", response);
  return {
    type: userConstants.PROFILE_SAVE,
    payload: response
  };  
}