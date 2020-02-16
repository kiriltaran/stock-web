import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { get } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "./StokrManagerSearch.scss";

type StokrManagerSearch = {
  onSuggestionSelect: (symbol: string) => void;
  onClose: () => void;
};

const StokrManagerSearch: React.FC<StokrManagerSearch> = ({
  onSuggestionSelect,
  onClose
}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<object[]>([]);

  const handleClose = () => {
    onClose();
    setQuery("");
  };

  const handleSuggestionSelect = (symbol: string) => {
    onSuggestionSelect(symbol);
    setQuery("");
  };

  const fetchSuggestions = useCallback(async (query: string) => {
    const { data } = await axios.get(
      `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=DRK70Y4J0KY6JLY4`
    );

    return data;
  }, []);

  const defineSuggestions = useCallback(
    async (query: string) => {
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
    },
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
            <span className="empty-text">Search</span>
          </div>
        )}
      </div>
    </div>
  );
};

export { StokrManagerSearch };
