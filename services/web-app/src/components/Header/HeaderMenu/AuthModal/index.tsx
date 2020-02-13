import React from "react";
import Modal from "../../../Modal";
import Overlay from "../../../OverLay";
import styles from "./style.module.scss";

export default () => (
  <Modal>
    <Modal.Trigger>
      {({ openModal }) => <button onClick={openModal}>Login/Signup</button>}
    </Modal.Trigger>
    <Modal.Content>
      {({ transitionStatus, closeModal }) => (
        <>
          <div className={`${styles.modal} ${styles[transitionStatus]}`}>
            <p>temp</p>
          </div>
          <Overlay
            close={closeModal}
            className={`${styles.overlay} ${styles[transitionStatus]}`}
          />
        </>
      )}
    </Modal.Content>
  </Modal>
);
