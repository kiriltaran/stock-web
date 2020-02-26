import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  companiesThunks,
  companiesActions,
  companiesSelectors,
  globalSelectors,
  globalActions
} from "../../../store";

import "./StokrManagerCompanies.scss";

import { StokrManagerCompany } from "../StokrManagerCompany";

const StokrManagerCompanies = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const companiesList = useSelector(companiesSelectors.list);
  const companiesFilteredList = useSelector(companiesSelectors.filteredList);
  const isEditing = useSelector(globalSelectors.isEditing);
  const [isRelativeDiffMode, setIsRelativeDiffMode] = useState(true);

  const fetchCompanies = useCallback(
    symbols => {
      dispatch(companiesThunks.fetchCompanies(symbols));
    },
    [dispatch]
  );

  const handleCompanyDelete = useCallback(
    (symbol: string) => {
      dispatch(companiesActions.deleteCompany(symbol));
    },
    [dispatch]
  );

  const handlePriceClick = useCallback(
    (symbol: string) => {
      dispatch(globalActions.filteringFinish());
      dispatch(globalActions.editingFinish());
      history.push(`/chart?symbol=${symbol}`);
    },
    [dispatch, history]
  );

  useEffect(() => {
    const symbols = companiesList.length
      ? companiesList.map(company => company.symbol)
      : ["WIX"];

    fetchCompanies(symbols);
    // eslint-disable-next-line
  }, [fetchCompanies]);

  return (
    <div className="stokr-manager-companies">
      {companiesFilteredList.map(company => (
        <StokrManagerCompany
          key={company.symbol}
          company={company}
          isEditing={isEditing}
          isPercentageDiff={isRelativeDiffMode}
          onDiffToggle={() => setIsRelativeDiffMode(!isRelativeDiffMode)}
          onPriceClick={() => handlePriceClick(company.symbol)}
          onDelete={() => handleCompanyDelete(company.symbol)}
        />
      ))}
    </div>
  );
};

export { StokrManagerCompanies };
