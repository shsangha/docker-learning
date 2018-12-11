import React from 'react';
import styles from './style.module.scss';
import SearchBar from './SearchBar';
import Logo from './Logo';
import HeaderMenu from './HeaderMenu';
import { SearchContextProvider } from './SearchContext';

export default () => (
  <SearchContextProvider>
    <header className={styles.globalHeader}>
      <div className={styles.wrapper}>
        <SearchBar />
        <Logo />
        <HeaderMenu />
      </div>
    </header>
  </SearchContextProvider>
);
