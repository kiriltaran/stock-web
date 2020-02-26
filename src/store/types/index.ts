import { CompaniesState } from "../companies";
import { GlobalState } from "../global";

export type RootState = {
  companies: CompaniesState;
  global: GlobalState;
};
