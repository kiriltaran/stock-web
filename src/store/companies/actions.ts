import { actionTypes } from "./actionTypes";
import { Company, Filters } from "../../types";

const fetchCompaniesRequest = () => ({
  type: actionTypes.FETCH_REQUEST
});

const fetchCompaniesSuccess = (companies: Company[]) => ({
  type: actionTypes.FETCH_SUCCESS,
  payload: companies
});

const fetchCompaniesFailure = (error: Error) => ({
  type: actionTypes.FETCH_FAILURE,
  payload: error
});

const addCompanyRequest = () => ({
  type: actionTypes.ADD_ITEM_REQUEST
});

const addCompanySuccess = (company: Company) => ({
  type: actionTypes.ADD_ITEM_SUCCESS,
  payload: company
});

const addCompanyFailure = (error: Error) => ({
  type: actionTypes.ADD_ITEM_FAILURE,
  payload: error
});

const filterCompanies = (filters: Filters) => ({
  type: actionTypes.FILTER,
  payload: filters
});

const deleteCompany = (symbol: string) => ({
  type: actionTypes.DELETE_ITEM,
  payload: symbol
});

export {
  fetchCompaniesRequest,
  fetchCompaniesSuccess,
  fetchCompaniesFailure,
  addCompanyRequest,
  addCompanySuccess,
  addCompanyFailure,
  deleteCompany,
  filterCompanies
};
