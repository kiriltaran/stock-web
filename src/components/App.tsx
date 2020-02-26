import React from "react";

import "./App.scss";

import { StokrManager } from "./StokrManager";

const App = () => {
  return (
    <div className="app">
      <div className="stokr-manager-wrapper">
        <StokrManager></StokrManager>
      </div>
    </div>
  );
};

export default App;
