import axios from "axios";
import { userConstants } from '../constants';

//target action for sending mail
export function sendmail(formdata, tokenFromStorage) {
  console.log("Inside Send Mail to Owner Post action")
  console.log(formdata)
  console.log("tokenFromStorage", tokenFromStorage)
  var config = {
    headers: {'Authorization': tokenFromStorage,
              'Content-Type': 'application/json'
    }
  };
  axios.defaults.withCredentials = true;
  const response =  axios.post('http://localhost:3001/homeaway/sendmail', formdata, config)
  console.log("send mail Response", response);
  return {
    type: userConstants.SEND_MAIL,
    payload: response
  };  
}

//target action to get emails for inbox
export function getemails(formdata, tokenFromStorage) {
  console.log("Inside get Mail Post action")
  console.log(formdata)
  console.log("tokenFromStorage", tokenFromStorage)
  var config = {
    headers: {'Authorization': tokenFromStorage,
              'Content-Type': 'application/json'
    }
  };
  axios.defaults.withCredentials = true;
  const response =  axios.post('http://localhost:3001/homeaway/getemails', formdata, config)
  console.log("Get emails Response", response);
  return {
    type: userConstants.GET_EMAILS,
    payload: response
  };  
}

//target action to get sent emails
export function getsentemails(formdata, tokenFromStorage) {
  console.log("Inside Get sent email Post action")
  console.log(formdata)
  console.log("tokenFromStorage", tokenFromStorage)
  var config = {
    headers: {'Authorization': tokenFromStorage,
              'Content-Type': 'application/json'
    }
  };
  axios.defaults.withCredentials = true;
  const response =  axios.post('http://localhost:3001/homeaway/getsentemails', formdata, config)
  console.log("Get sent emails Response", response);
  return {
    type: userConstants.GET_SENTEMAILS,
    payload: response
  };  
}