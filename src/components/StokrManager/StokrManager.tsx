import React, { useEffect, useState } from "react";
import axios from "axios";
import classNames from "classnames";
import { get, filter, floor, flow } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearchDollar,
  faRedoAlt,
  faFunnelDollar,
  faCog,
  faMinusCircle
} from "@fortawesome/free-solid-svg-icons";
import "./StokrManager.scss";

const StokrManager = () => {
  const [companies, setCompanies] = useState([] as object[]);
  const [suggestions, setSuggestions] = useState([] as object[]);
  const [nameFilter, setNameFilter] = useState("");
  const [fromFilter, setFromFilter] = useState("");
  const [toFilter, setToFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPercentMode, setIsPercentMode] = useState(true);
  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [isFilterShown, setIsFilterShown] = useState(false);
  const [isBeingSearched, setIsBeingSearched] = useState(false);

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
        get(company, "name").includes(nameFilter)
      );

    const filterByTo = (fullCompanies: object[]) =>
      toFilter
        ? filter(fullCompanies, company => get(company, "price") <= +toFilter)
        : fullCompanies;

    const filterByFrom = (fullCompanies: object[]) =>
      toFilter
        ? filter(fullCompanies, company => get(company, "price") >= +fromFilter)
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
          <div className="stokr-manager-header">
            <div className="header-top">
              <div className="header-column">
                <h1 className="stokr-title">Stokr</h1>
              </div>
              <div className="header-column">
                <div className="actions">
                  <button
                    aria-label="search"
                    className="actions__icon"
                    onClick={() => setIsBeingSearched(true)}
                  >
                    <FontAwesomeIcon icon={faSearchDollar} size="3x" />
                  </button>
                  <button
                    aria-label="refresh"
                    className="actions__icon"
                    onClick={refreshCompanies}
                  >
                    <FontAwesomeIcon icon={faRedoAlt} size="3x" />
                  </button>
                  <button
                    aria-label="filter"
                    className="actions__icon"
                    onClick={() => setIsFilterShown(!isFilterShown)}
                  >
                    <FontAwesomeIcon icon={faFunnelDollar} size="3x" />
                  </button>
                  <button
                    aria-label="settings"
                    className="actions__icon"
                    onClick={() => setIsBeingEdited(!isBeingEdited)}
                  >
                    <FontAwesomeIcon icon={faCog} size="3x" />
                  </button>
                </div>
              </div>
            </div>
            <div
              className={classNames({
                "header-dropdown": true,
                "header-dropdown--expanded": isFilterShown
              })}
            >
              <form className="filter-form">
                <div className="filter-form__column">
                  <label className="form-item">
                    <span className="form-item__key">By Name</span>
                    <div className="form-item__value">
                      <input
                        type="text"
                        className="value-input"
                        onChange={e => setNameFilter(e.target.value)}
                      />
                    </div>
                  </label>
                  <label className="form-item">
                    <span className="form-item__key">By Gain</span>
                    <div className="form-item__value">
                      <select className="value-select">
                        <option value="1">1</option>
                        <option value="2">2</option>
                      </select>
                    </div>
                  </label>
                </div>
                <div className="filter-form__column">
                  <label className="form-item">
                    <span className="form-item__key">By Range: From</span>
                    <div className="form-item__value">
                      <input
                        type="text"
                        className="value-input"
                        onChange={e => setFromFilter(e.target.value)}
                      />
                    </div>
                  </label>
                  <label className="form-item">
                    <span className="form-item__key">By Range: To</span>
                    <div className="form-item__value">
                      <input
                        type="text"
                        className="value-input"
                        onChange={e => setToFilter(e.target.value)}
                      />
                    </div>
                  </label>
                </div>
                {/* <div className="filter-form__column">
                  <button className="apply-btn">Apply</button>
                </div> */}
              </form>
            </div>
          </div>
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
