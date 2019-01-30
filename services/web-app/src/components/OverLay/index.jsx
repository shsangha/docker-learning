import React from 'react';
import propTypes from 'prop-types';
import styles from './style.module.scss';

const Overlay = ({ onClick, transitionStatus, fullScreen }) => {
  let classes;
  if (fullScreen) {
    classes = `${styles.overlay} ${styles[transitionStatus]}`;
  } else {
    classes = `${styles.overlay} ${styles.exposeHeader} ${styles[transitionStatus]}`;
  }

  // divs aren't tabbable doesn't make sense for there to be a key event handler in this case, will allow keyboard users to exit with the button or esc key instead
  // eslint-disable-next-line jsx-a11y/click-events-have-key-events
  return <div role="presentation" onClick={onClick} className={classes} />;
};

Overlay.propTypes = {
  onClick: propTypes.func,
  transitionStatus: propTypes.string.isRequired,
  fullScreen: propTypes.bool
};

Overlay.defaultProps = {
  onClick: () => {},
  fullScreen: true
};

export default Overlay;
