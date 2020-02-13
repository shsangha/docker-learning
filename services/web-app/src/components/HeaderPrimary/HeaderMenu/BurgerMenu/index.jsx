import React, { Fragment } from 'react';
import propTypes from 'prop-types';
import AuthCheckHOC from '../../../AuthCheckHOC';
import FavourtiesLink from '../Shared/FavourtiesLink';
import SignUpModal from '../Shared/SignUpModal';
import BMSidebar from './BMSidebar';

const BurgerMenu = ({ authStatus }) => (
  <Fragment>
    {authStatus ? <FavourtiesLink /> : <SignUpModal />}
    <BMSidebar />
  </Fragment>
);

BurgerMenu.propTypes = {
  authStatus: propTypes.bool.isRequired
};

export default AuthCheckHOC(BurgerMenu);
