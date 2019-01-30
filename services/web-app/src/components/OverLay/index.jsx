import React from 'react';
import propTypes from 'prop-types';

const Overlay = ({ onClick, classNames }) => {
  // divs aren't tabbable doesn't make sense for there to be a key event handler in this case, will allow keyboard users to exit with the button or esc key instead
  // eslint-disable-next-line jsx-a11y/click-events-have-key-events
  return <div role="presentation" onClick={onClick} className={classNames} />;
};

Overlay.propTypes = {
  onClick: propTypes.func,
  // fullScreen: propTypes.bool,
  classNames: propTypes.string.isRequired
};

Overlay.defaultProps = {
  onClick: () => {}
  // fullScreen: true
};

export default Overlay;
