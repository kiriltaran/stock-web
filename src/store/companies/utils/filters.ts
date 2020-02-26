import { flow } from "lodash";
import { Company, Filters } from "../../../types";

const filterByName = (name: string) => (companies: Company[]): Company[] =>
  companies.filter(
    company =>
      company.name.toLowerCase().includes(name.toLowerCase()) ||
      company.symbol.toLowerCase().includes(name.toLowerCase())
  );

const filterByTo = (to: number) => (companies: Company[]): Company[] =>
  companies.filter(company => company.price <= to);

const filterByFrom = (from: number) => (companies: Company[]): Company[] =>
  companies.filter(company => company.price >= from);

export const filterCompanies = (
  companies: Company[],
  { name, to, from }: Filters
): Company[] =>
  flow([filterByName(name), filterByTo(to), filterByFrom(from)])(companies);
