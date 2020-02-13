import React, { Fragment } from "react";
import SideBar from "../../../../SideBar";
import OverLay from "../../../../OverLay";
import styles from "./style.module.scss";

export default () => (
  <SideBar>
    <SideBar.OpenTrigger>
      {({ openSideBar }) => (
        <button type="button" onClick={openSideBar}>
          OPEN
        </button>
      )}
    </SideBar.OpenTrigger>
    <SideBar.Content>
      {({ transitionStatus, closeSideBar }) => (
        <Fragment>
          <div className={`${styles.content} ${styles[transitionStatus]}`}>
            OPEN IS TRUE
          </div>
          <OverLay
            onClick={closeSideBar}
            classNames={`${styles.overlay} ${styles[transitionStatus]}`}
          />
        </Fragment>
      )}
    </SideBar.Content>
  </SideBar>
);
