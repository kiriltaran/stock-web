import { RootState } from "../types";

const isFiltering = (state: RootState) => state.global.isFiltering;
const isEditing = (state: RootState) => state.global.isEditing;
const isLoading = (state: RootState) =>
  [state.companies.isLoading].includes(true);
const error = (state: RootState) => [state.companies.isLoading].includes(true);

export { isFiltering, isEditing, isLoading, error };
