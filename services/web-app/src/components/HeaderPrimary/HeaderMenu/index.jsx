import React from 'react';
import styles from './style.module.scss';
import { SearchContextConsumer } from '../SearchContext';

export default () => (
  <SearchContextConsumer>
    {({ state: { open } }) => {
      const className = open ? `${styles.menu} ${styles.open}` : `${styles.menu}`;
      return (
        <div className={className}>
          <a href="">item</a>
          <a href="">item</a>
          <a href="">item</a>
          <a href="">item</a>
          <a href="">item</a>
        </div>
      );
    }}
  </SearchContextConsumer>
);
