import React, { useState } from "react";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearchDollar,
  faRedoAlt,
  faFunnelDollar,
  faCog,
  faArrowLeft
} from "@fortawesome/free-solid-svg-icons";
import { Filters } from "../types";
import "./StokrManagerHeader.scss";

type StokrManagerHeaderProps = {
  isVisibleBack: boolean;
  onSearch: () => void;
  onRefresh: () => void;
  onEdit: () => void;
  onFilter: (filters: Filters) => void;
  onBack: () => void;
};

const StokrManagerHeader: React.FC<StokrManagerHeaderProps> = ({
  isVisibleBack,
  onSearch,
  onRefresh,
  onEdit,
  onFilter,
  onBack
}) => {
  const [isFilterShown, setIsFilterShown] = useState(false);
  const [nameFilter, setNameFilter] = useState("");
  const [fromFilter, setFromFilter] = useState("");
  const [toFilter, setToFilter] = useState("");

  const handleFiltersApply = () => {
    onFilter({
      name: nameFilter,
      to: toFilter,
      from: fromFilter
    });
  };

  return (
    <div className="stokr-manager-header">
      <div className="header-top">
        <div className="header-column">
          <h1 className="stokr-title">Stokr</h1>
        </div>
        <div className="header-column">
          <div
            className={classNames("actions", {
              "actions--back": isVisibleBack
            })}
          >
            <button
              aria-label="search"
              className="actions__icon"
              onClick={() => onSearch()}
            >
              <FontAwesomeIcon icon={faSearchDollar} size="3x" />
            </button>
            <button
              aria-label="refresh"
              className="actions__icon"
              onClick={() => onRefresh()}
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
              onClick={() => onEdit()}
            >
              <FontAwesomeIcon icon={faCog} size="3x" />
            </button>
            <button
              aria-label="back"
              className="actions__icon back-icon"
              onClick={() => onBack()}
            >
              <FontAwesomeIcon icon={faArrowLeft} size="3x" />
            </button>
          </div>
        </div>
      </div>
      <div
        className={classNames("header-dropdown", {
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
              <span className="form-item__key">From</span>
              <div className="form-item__value">
                <input
                  type="text"
                  className="value-input"
                  onChange={e => setFromFilter(e.target.value)}
                />
              </div>
            </label>
            <label className="form-item">
              <span className="form-item__key">To</span>
              <div className="form-item__value">
                <input
                  type="text"
                  className="value-input"
                  onChange={e => setToFilter(e.target.value)}
                />
              </div>
            </label>
          </div>
          <div className="filter-form__column">
            <button
              type="button"
              className="apply-btn"
              onClick={handleFiltersApply}
            >
              Apply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export { StokrManagerHeader };
