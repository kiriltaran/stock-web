import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router-dom";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearchDollar,
  faRedoAlt,
  faFunnelDollar,
  faCog,
  faArrowLeft
} from "@fortawesome/free-solid-svg-icons";
import {
  globalActions,
  globalSelectors,
  companiesThunks,
  companiesSelectors
} from "../../../store";

import "./StokrManagerHeader.scss";

const headerBackStateRoutes = ["/chart"];

const StokrManagerHeader = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const isBackState = useRouteMatch(headerBackStateRoutes);
  const companiesList = useSelector(companiesSelectors.list);
  const isFiltering = useSelector(globalSelectors.isFiltering);
  const isEditing = useSelector(globalSelectors.isEditing);

  const handleFilterIconClick = () => {
    const toggleFilteringAction = isFiltering
      ? globalActions.filteringFinish
      : globalActions.filteringStart;
    dispatch(toggleFilteringAction());
  };

  const handleEditIconClick = () => {
    const toggleEditingAction = isEditing
      ? globalActions.editingFinish
      : globalActions.editingStart;
    dispatch(toggleEditingAction());
  };

  const handleRefreshIconClick = () => {
    const symbols = companiesList.map(company => company.symbol);

    dispatch(companiesThunks.fetchCompanies(symbols));
  };

  const handleSearchIconClick = () => {
    history.push("/search");
  };

  const handleBackIconClick = () => {
    history.push("/");
  };

  return (
    <div className="stokr-manager-header">
      <div className="header-column">
        <h1 className="stokr-title">Stokr</h1>
      </div>
      <div className="header-column">
        <div
          className={classNames("actions", {
            "actions--back": isBackState
          })}
        >
          <button
            aria-label="search"
            className="actions__icon"
            onClick={handleSearchIconClick}
          >
            <FontAwesomeIcon icon={faSearchDollar} size="3x" />
          </button>
          <button
            aria-label="refresh"
            className="actions__icon"
            onClick={handleRefreshIconClick}
          >
            <FontAwesomeIcon icon={faRedoAlt} size="3x" />
          </button>
          <button
            aria-label="filter"
            className="actions__icon"
            onClick={handleFilterIconClick}
          >
            <FontAwesomeIcon icon={faFunnelDollar} size="3x" />
          </button>
          <button
            aria-label="settings"
            className="actions__icon"
            onClick={handleEditIconClick}
          >
            <FontAwesomeIcon icon={faCog} size="3x" />
          </button>
          <button
            aria-label="back"
            className="actions__icon back-icon"
            onClick={handleBackIconClick}
          >
            <FontAwesomeIcon icon={faArrowLeft} size="3x" />
          </button>
        </div>
      </div>
    </div>
  );
};

export { StokrManagerHeader };
