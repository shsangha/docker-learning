import React, { Fragment } from 'react';
import Modal from '../../../../Modal';
import SignupForm from './SignUpForm';
import Overlay from '../../../../OverLay';
import styles from './style.module.scss';

export default () => (
  <Modal>
    <Modal.Trigger>
      {({ openModal }) => (
        <button className={styles.signupBtn} type="button" onClick={openModal}>
          Signup
        </button>
      )}
    </Modal.Trigger>
    <Modal.Content>
      {({ transitionStatus, closeModal }) => (
        <Fragment>
          <div className={`${styles.modal} ${styles[transitionStatus]}`}>
            <SignupForm />
          </div>
          <Overlay
            onClick={closeModal}
            classNames={`${styles.overlay} ${styles[transitionStatus]}`}
          />
        </Fragment>
      )}
    </Modal.Content>
  </Modal>
);
