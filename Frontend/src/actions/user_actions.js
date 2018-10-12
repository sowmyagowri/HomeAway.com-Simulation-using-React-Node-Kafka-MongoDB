import axios from "axios";
import { userConstants } from '../constants';

//target action for traveller login
export function travellerlogin(data) {
  console.log("inside login")
  console.log(data)
  axios.defaults.withCredentials = true;
  const response =  axios.post('http://localhost:3001/homeaway/traveller/login',data);
  console.log("Response", response);
  return {
    type: userConstants.TRAVELLER_LOGIN,
    payload: response
  };  
}