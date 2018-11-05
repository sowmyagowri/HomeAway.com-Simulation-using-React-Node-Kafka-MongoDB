import axios from "axios";
import { userConstants } from '../constants';

//target action for property post
export function propertypost(formdata, tokenFromStorage) {
  console.log("Inside Owner Property Post action")
  console.log(formdata)
  console.log("tokenFromStorage", tokenFromStorage)
  var config = {
    headers: {'Authorization': tokenFromStorage,
              'Content-Type': 'application/json'
    }
  };
  axios.defaults.withCredentials = true;
  const response =  axios.post('ec2-13-57-49-252.us-west-1.compute.amazonaws.com:3001/homeaway/owner/listproperty', formdata, config)
  console.log("Response", response);
  return {
    type: userConstants.PROPERTY_POST,
    payload: response
  };  
}

//target action for property listings
export function propertylisting(formdata, tokenFromStorage) {
  console.log("Inside Owner Property Listing action")
  console.log(formdata)
  console.log("tokenFromStorage", tokenFromStorage)
  var config = {
    headers: {'Authorization': tokenFromStorage,
              'Content-Type': 'application/json'
    }
  };
  axios.defaults.withCredentials = true;
  const response =  axios.post('http://ec2-52-53-218-130.us-west-1.compute.amazonaws.com:3001/homeaway/owner/propertylistings', formdata, config)
  console.log("Response", response);
  return {
    type: userConstants.PROPERTY_LIST,
    payload: response
  };  
}

//target action for property search
export function propertysearch(formdata, tokenFromStorage) {
  console.log("Inside Owner Property Search action")
  console.log(formdata)
  console.log("tokenFromStorage", tokenFromStorage)
  var config = {
    headers: {'Authorization': tokenFromStorage,
              'Content-Type': 'application/json'
    }
  };
  axios.defaults.withCredentials = true;
  const response =  axios.post('http://ec2-52-53-218-130.us-west-1.compute.amazonaws.com:3001/homeaway/property/search', formdata, config)
  console.log("Response", response);
  return {
    type: userConstants.PROPERTY_SEARCH,
    payload: response
  };  
}

//target action for property details
export function propertydetails(propertyID, tokenFromStorage) {
  console.log("Inside Owner Property Details Fetch action")
  console.log(propertyID)
  console.log("tokenFromStorage", tokenFromStorage)
  var config = {
    headers: {'Authorization': tokenFromStorage,
              'Content-Type': 'application/json'
    }
  };
  axios.defaults.withCredentials = true;

  var url = "http://ec2-52-53-218-130.us-west-1.compute.amazonaws.com:3001/homeaway/property/" + propertyID;   
  const response =  axios.get(url, config)
  console.log("Response", response);
  return {
    type: userConstants.PROPERTY_DETAILS,
    payload: response
  };  
}

//target action for property book
export function propertybook(formdata, tokenFromStorage) {
  console.log("Inside Traveler Property Book action")
  console.log(formdata)
  console.log("tokenFromStorage", tokenFromStorage)
  var config = {
    headers: {'Authorization': tokenFromStorage,
              'Content-Type': 'application/json'
    }
  };
  axios.defaults.withCredentials = true;
  const response =  axios.post('http://ec2-52-53-218-130.us-west-1.compute.amazonaws.com:3001/homeaway/bookproperty', formdata, config)
  console.log("Response", response);
  return {
    type: userConstants.PROPERTY_BOOK,
    payload: response
  };  
}

//target action to list bookings
export function travellertrips(formdata, tokenFromStorage) {
  console.log("Inside Traveler Booking List action")
  console.log(formdata)
  console.log("tokenFromStorage", tokenFromStorage)
  var config = {
    headers: {'Authorization': tokenFromStorage,
              'Content-Type': 'application/json'
    }
  };
  axios.defaults.withCredentials = true;
  const response =  axios.post('http://ec2-52-53-218-130.us-west-1.compute.amazonaws.com:3001/homeaway/traveller/triplistings', formdata, config)
  console.log("Response", response);
  return {
    type: userConstants.LIST_BOOKINGS,
    payload: response
  };  
}