import { Reducer } from "redux";
import { actionTypes } from "./actionTypes";
import { Company } from "../../types";
import { CompaniesState } from "./types";

const initialState: CompaniesState = {
  list: [],
  filters: {
    name: "",
    to: Infinity,
    from: 0
  },
  isLoading: false,
  error: null
};

const reducer: Reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case actionTypes.FETCH_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case actionTypes.FETCH_SUCCESS: {
      return {
        ...state,
        list: payload,
        isLoading: false
      };
    }
    case actionTypes.FETCH_FAILURE: {
      return {
        ...state,
        error: payload,
        isLoading: false
      };
    }
    case actionTypes.ADD_ITEM_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case actionTypes.ADD_ITEM_SUCCESS: {
      return {
        ...state,
        list: [...state.list, ...payload],
        isLoading: true
      };
    }
    case actionTypes.ADD_ITEM_FAILURE: {
      return {
        ...state,
        error: payload,
        isLoading: false
      };
    }
    case actionTypes.DELETE_ITEM: {
      return {
        ...state,
        list: [
          ...state.list.filter((company: Company) => company.symbol !== payload)
        ]
      };
    }
    case actionTypes.FILTER: {
      return {
        ...state,
        filters: payload
      };
    }
    default:
      return state;
  }
};

export { reducer };
