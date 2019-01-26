/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import styles from './style.module.scss';

const Label = () => (
  <label className={styles.search_label} htmlFor="header_search">
    <svg className={styles.icon}>
      <use xlinkHref="../../../../../public/sprite.svg#icon-search" />
    </svg>
  </label>
);

export default Label;
