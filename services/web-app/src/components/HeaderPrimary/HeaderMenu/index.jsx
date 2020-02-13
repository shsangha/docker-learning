import React from 'react';
import propTypes from 'prop-types';
import styles from './style.module.scss';
import FullMenu from './FullMenu';
import BurgerMenu from './BurgerMenu';
import ScreenWidthHOC from '../../ScreenWidthHOC';

const HeaderMenu = ({ windowWidth }) => {
  const Menu = windowWidth < 1000 ? BurgerMenu : FullMenu;

  return (
    <div className={styles.headerMenu}>
      <Menu />
    </div>
  );
};

HeaderMenu.propTypes = {
  windowWidth: propTypes.number.isRequired
};

export default ScreenWidthHOC(HeaderMenu);
