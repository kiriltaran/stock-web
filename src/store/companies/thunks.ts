import axios from "axios";
import { Dispatch } from "redux";
import * as companiesActions from "./actions";

const fetchCompanies = (symbols: string[]) => async (dispatch: Dispatch) => {
  try {
    dispatch(companiesActions.fetchCompaniesRequest());

    const { data } = await axios.get(
      `http://localhost:8080/api/v1/prices?${symbols
        .map(symbol => `symbol=${symbol}`)
        .join("&")}`
    );

    dispatch(companiesActions.fetchCompaniesSuccess(data));
  } catch (error) {
    dispatch(companiesActions.fetchCompaniesFailure(error));
  }
};

const addCompany = (symbol: string) => async (dispatch: Dispatch) => {
  try {
    dispatch(companiesActions.addCompanyRequest());

    const { data } = await axios.get(
      `http://localhost:8080/api/v1/prices?symbol=${symbol}`
    );

    dispatch(companiesActions.addCompanySuccess(data));
  } catch (error) {
    dispatch(companiesActions.addCompanyFailure(error));
    throw error;
  }
};

export { fetchCompanies, addCompany };
