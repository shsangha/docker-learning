import React from 'react';
import styles from './style.module.scss';
import Logo from './Logo';
import HeaderMenu from './HeaderMenu';
import SearchBar from './SearchBar';

export default () => (
  <header className={styles.globalHeader}>
    <div className={styles.wrapper}>
      <SearchBar />
      <Logo />
      <HeaderMenu />
    </div>
  </header>
);
