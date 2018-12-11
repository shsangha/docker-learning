import React from 'react';
import { hot } from 'react-hot-loader';
import './style.scss';
import HeaderPrimary from '../HeaderPrimary';

const App = () => (
  <div className="app">
    <HeaderPrimary />
  </div>
);

export default hot(module)(App);
