import { composeWithDevTools } from "redux-devtools-extension";
import { combineReducers, createStore } from "redux";

import closeStationsReducer from "./closeStations";
import userCoordsReducer from "./userCoords";

const rootReducer = combineReducers({
  closeStations: closeStationsReducer,
  userCoords: userCoordsReducer
});

export const store = createStore(rootReducer, composeWithDevTools());
