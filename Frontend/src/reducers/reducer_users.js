import _ from "lodash";
import { userConstants } from '../constants';

//Reducer listening to different action types

export function authentication(state = {}, action) {
  switch (action.type) {
    case userConstants.DO_TRAVELLER_LOGIN:
      return action.payload;
    default:
      return state;
  }
}