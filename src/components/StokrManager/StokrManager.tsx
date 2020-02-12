import React, { useEffect, useState } from "react";
import axios from "axios";
import classNames from "classnames";
import { get, filter, floor, flow } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { Filters } from "./types";
import "./StokrManager.scss";

import { StokrManagerHeader } from "./StokrManagerHeader";

const StokrManager = () => {
  const [companies, setCompanies] = useState([] as object[]);
  const [suggestions, setSuggestions] = useState([] as object[]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPercentMode, setIsPercentMode] = useState(true);
  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [isBeingSearched, setIsBeingSearched] = useState(false);
  // -----------------------------------------------------------
  const [filters, setFilters] = useState({
    name: "",
    to: "",
    from: ""
  } as Filters);

  useEffect(() => {
    defineCompanies();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (searchQuery) {
      defineSuggestions(searchQuery);
    }
    // eslint-disable-next-line
  }, [searchQuery]);

  const getFilteredCompanies = (): object[] => {
    const filterByName = (fullCompanies: object[]) =>
      filter(fullCompanies, company =>
        get(company, "name")
          .toLowerCase()
          .includes(get(filters, "name").toLowerCase())
      );

    const filterByTo = (fullCompanies: object[]) =>
      get(filters, "to")
        ? filter(
            fullCompanies,
            company => get(company, "price") <= Number(get(filters, "to"))
          )
        : fullCompanies;

    const filterByFrom = (fullCompanies: object[]) =>
      get(filters, "from")
        ? filter(
            fullCompanies,
            company => get(company, "price") >= Number(get(filters, "from"))
          )
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

  const fetchSuggestions = async (query: string) => {
    const { data } = await axios.get(
      `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=DRK70Y4J0KY6JLY4`
    );

    return data;
  };

  const handleSearchClose = () => {
    setIsBeingSearched(false);
    setSearchQuery("");
  };

  const defineCompanies = async () => {
    try {
      const companies = await fetchCompanies(["WIX"]);

      setCompanies(companies);
    } catch (error) {
      console.log(error);
    }
  };

  const defineSuggestions = async (query: string) => {
    try {
      const response = await fetchSuggestions(query);

      setSuggestions(
        filter(
          get(response, "bestMatches", []),
          (suggestion, index: number) => index < 6
        )
      );
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
      setSearchQuery("");
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
              <div
                key={get(company, "symbol")}
                className={classNames({
                  company: true,
                  "company--edited": isBeingEdited
                })}
              >
                <div className="company__column delete-column">
                  <button
                    aria-label="delete"
                    className="delete-column__btn"
                    onClick={() => deleteCompany(get(company, "symbol"))}
                  >
                    <FontAwesomeIcon icon={faMinusCircle} size="2x" />
                  </button>
                </div>
                <div className="company__column name-column">
                  <span className="name-column__symbol">
                    {get(company, "symbol")}
                  </span>
                  <span className="name-column__name">
                    ({get(company, "name")})
                  </span>
                </div>
                <div className="company__column price-column">
                  {get(company, "price")}
                </div>
                <div className="company__column diff-column">
                  <button
                    type="button"
                    className={classNames({
                      "diff-column__btn": true,
                      "diff-column__btn--positive": isPercentMode
                        ? parseFloat(get(company, "change_percent")) > 0
                        : get(company, "change") > 0,
                      "diff-column__btn--negative": isPercentMode
                        ? parseFloat(get(company, "change_percent")) < 0
                        : get(company, "change") < 0
                    })}
                    onClick={() => setIsPercentMode(!isPercentMode)}
                  >
                    {isPercentMode
                      ? `${floor(
                          parseFloat(get(company, "change_percent")),
                          2
                        )}%`
                      : get(company, "change")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="stokr-manager-search">
          <div className="search-header">
            <div className="search-header__autocomplete">
              <input
                value={searchQuery}
                type="text"
                className="autocomplete-input"
                onChange={e => setSearchQuery(e.target.value)}
              />
              <button
                type="button"
                className="autocomplete-btn"
                onClick={handleSearchClose}
              >
                Cancel
              </button>
            </div>
          </div>
          <div className="search-body">
            {searchQuery && suggestions.length ? (
              <div className="suggestions">
                {suggestions.map(suggestion => (
                  <div
                    key={get(suggestion, "1. symbol")}
                    className="suggestions__item"
                    onClick={() => addCompany(get(suggestion, "1. symbol"))}
                  >
                    <span className="suggestion-symbol">
                      {get(suggestion, "1. symbol")}
                    </span>
                    <span className="suggestion-name">
                      ({get(suggestion, "2. name")})
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="search-body__empty-state">
                <div className="empty-img"></div>
                <span className="empty-text">Search</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { StokrManager };
