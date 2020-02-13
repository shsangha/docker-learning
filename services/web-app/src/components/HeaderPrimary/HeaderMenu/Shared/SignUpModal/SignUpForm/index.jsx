import React, { Component, Suspense } from 'react';
import ScreenWidthHOC from '../../../../../ScreenWidthHOC';
import styles from './style.module.scss';

const SignupAside = React.lazy(() => import('./SignupAside'));

const SignupForm = ({ windowWidth }) => {
  return (
    <div className={styles.container}>
      {windowWidth > 700 ? (
        <Suspense fallback={<div className={styles.aside} />}>
          <SignupAside />
        </Suspense>
      ) : null}
      <div className={styles.signupForm}>
        <div className={styles.signupForm__topBar}>
          <h3 className={styles.signupForm__instructions}>Sign Up or Login</h3>
          <button type="button" className={styleMedia.signupForm__closeBtn}>
            X
          </button>
        </div>
        <div className={styles.signupForm__content}>
          <h6 className={styles.noe}>If you don't have and account we'll create one for you</h6>
          <form action="">
            <label htmlFor="email">
              Email
              <span>*</span>
            </label>
            <input type="email" name="email" />
            <label htmlFor="password">password</label>
            <input type="password" name="password" />
            <button type="submit">Sign Up/Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ScreenWidthHOC(SignupForm);
