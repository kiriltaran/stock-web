import React from "react";
import classNames from "classnames";
import { get, floor } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { Company } from "../types";
import "./StokrManagerCompany.scss";

type StokrManagerCompanyProps = {
  company: Company;
  isEditing: boolean;
  isPercentageDiff: boolean;
  onDelete: () => void;
  onDiffToggle: () => void;
};

const StokrManagerCompany: React.FC<StokrManagerCompanyProps> = ({
  company,
  isPercentageDiff,
  isEditing,
  onDelete,
  onDiffToggle
}) => {
  return (
    <div
      key={get(company, "symbol")}
      className={classNames({
        "stokr-manager-company": true,
        "stokr-manager-company--edited": isEditing
      })}
    >
      <div className="stokr-manager-company__column delete-column">
        <button
          aria-label="delete"
          className="delete-column__btn"
          onClick={onDelete}
        >
          <FontAwesomeIcon icon={faMinusCircle} size="2x" />
        </button>
      </div>
      <div className="stokr-manager-company__column name-column">
        <span className="name-column__symbol">{get(company, "symbol")}</span>
        <span className="name-column__name">({get(company, "name")})</span>
      </div>
      <div className="stokr-manager-company__column price-column">
        {get(company, "price")}
      </div>
      <div className="stokr-manager-company__column diff-column">
        <button
          type="button"
          className={classNames({
            "diff-column__btn": true,
            "diff-column__btn--positive": isPercentageDiff
              ? parseFloat(get(company, "change_percent")) > 0
              : get(company, "change") > 0,
            "diff-column__btn--negative": isPercentageDiff
              ? parseFloat(get(company, "change_percent")) < 0
              : get(company, "change") < 0
          })}
          onClick={onDiffToggle}
        >
          {isPercentageDiff
            ? `${floor(parseFloat(get(company, "change_percent")), 2)}%`
            : get(company, "change")}
        </button>
      </div>
    </div>
  );
};

export { StokrManagerCompany };
