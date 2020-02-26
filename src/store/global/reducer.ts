import { Reducer } from "redux";
import { actionTypes } from "./actionTypes";

const initialState = {
  isEditing: false,
  isFiltering: false
};

const reducer: Reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case actionTypes.EDITING_START: {
      return {
        ...state,
        isEditing: true
      };
    }
    case actionTypes.EDITING_FINISH: {
      return {
        ...state,
        isEditing: false
      };
    }
    case actionTypes.FILTERING_START: {
      return {
        ...state,
        isFiltering: true
      };
    }
    case actionTypes.FILTERING_FINISH: {
      return {
        ...state,
        isFiltering: false
      };
    }
    default:
      return state;
  }
};

export { reducer };
