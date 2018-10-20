import { userConstants } from '../constants';

//Reducer listening to different action types

export function authentication(state = {}, action) {
  switch (action.type) {
    case userConstants.DO_TRAVELLER_LOGIN:
      return action.payload;
    case userConstants.DO_TRAVELLER_SIGNUP:
      return action.payload;
    case userConstants.DO_OWNER_LOGIN:
      return action.payload;
    case userConstants.DO_OWNER_SIGNUP:
      return action.payload;
    case userConstants.DO_PROFILE_FETCH:
      return action.payload;
    case userConstants.DO_PROFILE_SAVE:
      return action.payload;
    case userConstants.PROPERTY_POST:
      return action.payload;
    case userConstants.PROPERTY_SEARCH:
      return action.payload;
    case userConstants.PROPERTY_DETAILS:
      return action.payload;
    case userConstants.PROPERTY_BOOK:
      return action.payload;
    case userConstants.LIST_BOOKINGS:
      return action.payload;
    default:
      return state;
  }
}