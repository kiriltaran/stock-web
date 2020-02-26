import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import axios from "axios";
import { get, debounce } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { companiesThunks } from "../../../store";

import "./StokrManagerSearch.scss";

const StokrManagerSearch = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<object[]>([]);

  const handleClose = () => {
    history.push("/");
  };

  const handleSuggestionSelect = async (symbol: string) => {
    await dispatch(companiesThunks.addCompany(symbol));
    history.push("/");
  };

  const fetchSuggestions = useCallback(async (query: string) => {
    const { data } = await axios.get(
      `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=DRK70Y4J0KY6JLY4`
    );

    return data;
  }, []);

  const defineSuggestions = useCallback(
    debounce(async (query: string) => {
      try {
        const response = await fetchSuggestions(query);

        setSuggestions(
          get(response, "bestMatches", []).filter(
            (suggestion: object, index: number) => index < 6
          )
        );
      } catch (error) {
        console.log(error);
      }
    }, 500),
    [fetchSuggestions]
  );

  useEffect(() => {
    if (query) {
      defineSuggestions(query);
    }
  }, [defineSuggestions, query]);

  return (
    <div className="stokr-manager-search">
      <div className="search-header">
        <div className="search-header__autocomplete">
          <input
            value={query}
            type="text"
            className="autocomplete-input"
            onChange={e => setQuery(e.target.value)}
          />
          <button
            type="button"
            className="autocomplete-btn"
            onClick={handleClose}
          >
            Cancel
          </button>
        </div>
      </div>
      <div className="search-body">
        {query && suggestions.length ? (
          <div className="suggestions">
            {suggestions.map(suggestion => (
              <div
                key={get(suggestion, "1. symbol")}
                className="suggestions__item"
              >
                <div className="info">
                  <span className="suggestion-symbol">
                    {get(suggestion, "1. symbol")}
                  </span>
                  <span className="suggestion-name">
                    ({get(suggestion, "2. name")})
                  </span>
                </div>
                <div className="actions">
                  <button
                    className="add-btn"
                    onClick={() =>
                      handleSuggestionSelect(get(suggestion, "1. symbol"))
                    }
                  >
                    <FontAwesomeIcon icon={faPlus} size="3x" color="#fff" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="search-body__empty-state">
            <div className="empty-img"></div>
            <span className="empty-text">
              {query && !suggestions.length ? "Not found" : "Search"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export { StokrManagerSearch };
