import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { hot } from "react-hot-loader";
import "./style.scss";
import MobileDetect from "../MobileDetect";
import Header from "../Header";
import Container from "../DND/container";
const App = () => (
  <Router>
    <div className="app">
      <MobileDetect />
      <Container />
      {/* <Header /> */}
      {/* <FormTest />*/}
    </div>
  </Router>
);

export default hot(module)(App);
