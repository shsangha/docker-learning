import React from 'react';
import styles from './style.module.scss';

const CloseButton = ({ closeMenu }) => (
  <button type="submit" onClick={closeMenu} className={styles.closeBtn}>
    X
  </button>
);

export default CloseButton;
