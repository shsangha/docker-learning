import React from 'react';
import style from './style.module.scss';
import { SearchContextConsumer } from '../SearchContext';

export default ({ open }) => {
  const className = open ? `${style.logo} ${style.searchOpen}` : `${style.logo}`;
  return (
    <a className={className} href="/">
      <p className={style.logo__text}>grailed</p>
    </a>
  );
};
