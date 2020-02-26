import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { companiesActions } from "../../../store";

import "./StokrManagerFilter.scss";

const StokrManagerFilter = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const handleApplyClick = () => {
    dispatch(
      companiesActions.filterCompanies({
        name,
        from: from === "" ? 0 : Number(from),
        to: to === "" ? Infinity : Number(to)
      })
    );
  };

  return (
    <div className="stokr-manager-filter">
      <form className="filter-form">
        <div className="filter-form__column">
          <label className="form-item">
            <span className="form-item__key">By Name</span>
            <div className="form-item__value">
              <input
                type="text"
                className="value-input"
                onChange={e => setName(e.target.value)}
              />
            </div>
          </label>
          <label className="form-item">
            <span className="form-item__key">By Gain</span>
            <div className="form-item__value">
              <select className="value-select">
                <option value="1">ASC</option>
                <option value="2">DESC</option>
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
                onChange={e => setFrom(e.target.value)}
              />
            </div>
          </label>
          <label className="form-item">
            <span className="form-item__key">To</span>
            <div className="form-item__value">
              <input
                type="text"
                className="value-input"
                onChange={e => setTo(e.target.value)}
              />
            </div>
          </label>
        </div>
        <div className="filter-form__column">
          <button
            type="button"
            className="apply-btn"
            onClick={handleApplyClick}
          >
            Apply
          </button>
        </div>
      </form>
    </div>
  );
};

export { StokrManagerFilter };
