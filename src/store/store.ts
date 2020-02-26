import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { reducer as companiesReducer } from "./companies";
import { reducer as globalReducer } from "./global";

const rootReducer = combineReducers({
  global: globalReducer,
  companies: companiesReducer
});

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export { store };
