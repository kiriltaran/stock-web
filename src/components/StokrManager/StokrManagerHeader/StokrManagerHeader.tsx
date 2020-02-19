import React from "react";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearchDollar,
  faRedoAlt,
  faFunnelDollar,
  faCog,
  faArrowLeft
} from "@fortawesome/free-solid-svg-icons";
import "./StokrManagerHeader.scss";

type StokrManagerHeaderProps = {
  isBackState: boolean;
  onSearch: () => void;
  onRefresh: () => void;
  onFilter: () => void;
  onEdit: () => void;
  onBack: () => void;
};

const StokrManagerHeader: React.FC<StokrManagerHeaderProps> = ({
  isBackState,
  onSearch,
  onRefresh,
  onFilter,
  onEdit,
  onBack
}) => {
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
            onClick={() => onFilter()}
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
  );
};

export { StokrManagerHeader };
