import React from "react";
import classNames from "classnames";
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
  const diffBtnCls = classNames("diff-column__btn", {
    "diff-column__btn--positive": company.change > 0,
    "diff-column__btn--negative": company.change < 0
  });

  return (
    <div
      key={company.symbol}
      className={classNames("stokr-manager-company", {
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
        <span className="name-column__symbol">{company.symbol}</span>
        <span className="name-column__name">({company.name})</span>
      </div>
      <div className="stokr-manager-company__column price-column">
        {company.price}
      </div>
      <div className="stokr-manager-company__column diff-column">
        <button type="button" className={diffBtnCls} onClick={onDiffToggle}>
          {isPercentageDiff
            ? `${parseFloat(company.change_percent).toFixed(2)}%`
            : company.change}
        </button>
      </div>
    </div>
  );
};

export { StokrManagerCompany };
