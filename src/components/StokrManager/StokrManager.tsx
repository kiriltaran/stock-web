import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import classNames from "classnames";
import { flow } from "lodash";
import { Filters, Company } from "./types";
import "./StokrManager.scss";

import { StokrManagerHeader } from "./StokrManagerHeader";
import { StokrManagerFilter } from "./StokrManagerFilter";
import { StokrManagerCompany } from "./StokrManagerCompany";
import { StokrManagerChart } from "./StokrManagerChart";
import { StokrManagerSearch } from "./StokrManagerSearch";

const StokrManager = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [chartSymbol, setChartSymbol] = useState<string | null>(null);
  const [isPercentMode, setIsPercentMode] = useState(true);
  const [isBeingFiltered, setIsBeingFiltered] = useState(false);
  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [isBeingSearched, setIsBeingSearched] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    name: "",
    to: "",
    from: ""
  });

  const defineCompanies = useCallback(async () => {
    try {
      const companies = await fetchCompanies(["WIX", "MSFT", "AAPL", "AMZN"]);

      setCompanies(companies);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    defineCompanies();
  }, [defineCompanies]);

  const getFilteredCompanies = (): Company[] => {
    const filterByName = (fullCompanies: Company[]) =>
      fullCompanies.filter(company =>
        company.name.toLowerCase().includes(filters.name.toLowerCase())
      );

    const filterByTo = (fullCompanies: Company[]) =>
      filters.to
        ? fullCompanies.filter(company => company.price <= Number(filters.to))
        : fullCompanies;

    const filterByFrom = (fullCompanies: Company[]) =>
      filters.from
        ? fullCompanies.filter(company => company.price >= Number(filters.from))
        : fullCompanies;

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

  const handlePriceClick = (symbol: string) => {
    setChartSymbol(symbol);
  };

  const refreshCompanies = async () => {
    try {
      const companiesSymbols = companies.map(company => company.symbol);

      const newCompanies = await fetchCompanies(companiesSymbols);

      setCompanies(newCompanies);
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
    setCompanies(companies.filter(company => company.symbol !== symbol));
  };

  return (
    <div
      className={classNames("stokr-manager", {
        "stokr-manager--searched": isBeingSearched
      })}
    >
      <div className="stokr-manager-inner">
        <div className="stokr-manager-main">
          <div className="stokr-manager-header-wrapper">
            <StokrManagerHeader
              isBackState={Boolean(chartSymbol)}
              onSearch={() => setIsBeingSearched(true)}
              onRefresh={refreshCompanies}
              onEdit={() => setIsBeingEdited(!isBeingEdited)}
              onFilter={() => {
                setIsBeingFiltered(!isBeingFiltered);
              }}
              onBack={() => {
                setChartSymbol(null);
              }}
            />
          </div>
          <div
            className={classNames("stokr-manager-filter-wrapper", {
              "stokr-manager-filter-wrapper--slided": isBeingFiltered
            })}
          >
            <StokrManagerFilter onFilter={setFilters} />
          </div>
          <div
            className={classNames("stokr-manager-body", {
              "stokr-manager-body--charted": chartSymbol
            })}
          >
            <div className="stokr-manager-body__companies">
              {getFilteredCompanies().map(company => (
                <StokrManagerCompany
                  key={company.symbol}
                  company={company}
                  isEditing={isBeingEdited}
                  isPercentageDiff={isPercentMode}
                  onPriceClick={() => handlePriceClick(company.symbol)}
                  onDiffToggle={() => setIsPercentMode(!isPercentMode)}
                  onDelete={() => deleteCompany(company.symbol)}
                />
              ))}
            </div>
            <div className="stokr-manager-body__chart">
              {chartSymbol && <StokrManagerChart symbol={chartSymbol} />}
            </div>
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
