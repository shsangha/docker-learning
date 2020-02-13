/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import styles from './style.module.scss';

const Label = () => (
  <label
    aria-label="Search designers and more"
    className={styles.search_label}
    htmlFor="header_search"
  >
    <svg aria-labelledby="header-search-icon" className={styles.icon}>
      <title id="header-search-icon">Search for designers</title>
      <use xlinkHref="../../../../../public/sprite.svg#icon-search" />
    </svg>
  </label>
);

export default Label;
