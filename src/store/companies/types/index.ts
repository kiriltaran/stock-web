import { Company, Filters } from "../../../types";

export type CompaniesState = {
  list: Company[];
  filters: Filters;
  isLoading: boolean;
  error: Error | null;
};
