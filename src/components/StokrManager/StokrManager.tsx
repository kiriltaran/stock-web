import React, { useEffect, useState } from "react";
import axios from "axios";
import classNames from "classnames";
import { get, filter, flow } from "lodash";
import { Filters, Company } from "./types";
import "./StokrManager.scss";

import { StokrManagerHeader } from "./StokrManagerHeader";
import { StokrManagerCompany } from "./StokrManagerCompany";
import { StokrManagerSearch } from "./StokrManagerSearch";

const StokrManager = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isPercentMode, setIsPercentMode] = useState(true);
  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [isBeingSearched, setIsBeingSearched] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    name: "",
    to: "",
    from: ""
  });

  useEffect(() => {
    defineCompanies();
    // eslint-disable-next-line
  }, []);

  const getFilteredCompanies = (): Company[] => {
    const filterByName = (fullCompanies: Company[]) =>
      filter(fullCompanies, company =>
        get(company, "name")
          .toLowerCase()
          .includes(get(filters, "name").toLowerCase())
      );

    const filterByTo = (fullCompanies: Company[]) =>
      get(filters, "to")
        ? filter(
            fullCompanies,
            company => get(company, "price") <= Number(get(filters, "to"))
          )
        : fullCompanies;

    const filterByFrom = (fullCompanies: Company[]) =>
      get(filters, "from")
        ? filter(
            fullCompanies,
            company => get(company, "price") >= Number(get(filters, "from"))
          )
        : fullCompanies;

    console.log(flow([filterByName, filterByTo, filterByFrom])(companies));
    return flow([filterByName, filterByTo, filterByFrom])(companies);
  };

  const fetchCompanies = async (symbols: string[]) => {
    const { data } = await axios.get(
      `http://localhost:8080/api/v1/prices?${symbols
        .map(symbol => `symbol=${symbol}`)
        .join("&")}`
    );

    return data;
  };

  const handleSearchClose = () => {
    setIsBeingSearched(false);
  };

  const defineCompanies = async () => {
    try {
      const companies = await fetchCompanies(["WIX"]);

      setCompanies(companies);
    } catch (error) {
      console.log(error);
    }
  };

  const refreshCompanies = async () => {
    try {
      const companiesSymbols = companies.map(company => get(company, "symbol"));

      const responseCompanies = await fetchCompanies(companiesSymbols);

      setCompanies(responseCompanies);
    } catch (error) {
      console.log(error);
    }
  };

  const addCompany = async (symbol: string) => {
    try {
      const company = await fetchCompanies([symbol]);

      setCompanies([...companies, ...company]);
      setIsBeingSearched(false);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCompany = (symbol: string) => {
    setCompanies(
      companies.filter(company => get(company, "symbol") !== symbol)
    );
  };

  return (
    <div
      className={classNames({
        "stokr-manager": true,
        "stokr-manager--searched": isBeingSearched
      })}
    >
      <div className="stokr-manager-inner">
        <div className="stokr-manager-main">
          <StokrManagerHeader
            onSearch={() => setIsBeingSearched(true)}
            onRefresh={refreshCompanies}
            onEdit={() => setIsBeingEdited(!isBeingEdited)}
            onFilter={setFilters}
          />
          <div className="stokr-manager-body">
            {getFilteredCompanies().map(company => (
              <StokrManagerCompany
                key={company.symbol}
                company={company}
                isEditing={isBeingEdited}
                isPercentageDiff={isPercentMode}
                onDiffToggle={() => setIsPercentMode(!isPercentMode)}
                onDelete={() => deleteCompany(company.symbol)}
              />
            ))}
          </div>
        </div>
        <StokrManagerSearch
          onSuggestionSelect={addCompany}
          onClose={handleSearchClose}
        />
      </div>
    </div>
  );
};

export { StokrManager };
