import { createSelector } from "reselect";
import { filterCompanies } from "./utils";
import { RootState } from "../types";

const list = (state: RootState) => state.companies.list;
const filters = (state: RootState) => state.companies.filters;
const filteredList = createSelector(list, filters, filterCompanies);

export { list, filters, filteredList };
