import React from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import classNames from "classnames";
import { globalSelectors } from "../../store";

import "./StokrManager.scss";

import { StokrManagerHeader } from "./StokrManagerHeader";
import { StokrManagerFilter } from "./StokrManagerFilter";
import { StokrManagerCompanies } from "./StokrManagerCompanies";
import { StokrManagerChart } from "./StokrManagerChart";
import { StokrManagerSearch } from "./StokrManagerSearch";

const StokrManager = () => {
  const isFiltering = useSelector(globalSelectors.isFiltering);

  return (
    <BrowserRouter>
      <div className="stokr-manager">
        <Switch>
          <Route path="/search">
            <StokrManagerSearch />
          </Route>
          <Route path="/">
            <div className="stokr-manager-main">
              <div className="stokr-manager-header-wrapper">
                <StokrManagerHeader />
              </div>
              <div
                className={classNames("stokr-manager-filter-wrapper", {
                  "stokr-manager-filter-wrapper--visible": isFiltering
                })}
              >
                <StokrManagerFilter />
              </div>
              <div className="stokr-manager-body">
                <Switch>
                  <Route path="/" exact>
                    <StokrManagerCompanies />
                  </Route>
                  <Route path="/chart" exact>
                    <StokrManagerChart />
                  </Route>
                </Switch>
              </div>
            </div>
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export { StokrManager };
