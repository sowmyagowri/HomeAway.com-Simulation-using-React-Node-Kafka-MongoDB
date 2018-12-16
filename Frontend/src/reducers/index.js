import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import { authentication } from "./reducer_users";

const rootReducer = combineReducers({
  authentication,
  formReducer
});

export default rootReducer;