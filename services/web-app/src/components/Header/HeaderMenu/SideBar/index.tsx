import React from "react";
import SideBar from "../../../SideBar";
import Burger from "./burger";
import styles from "./style.module.scss";
import Overlay from "../../.././OverLay";

export default () => {
  let ref: React.RefObject<HTMLAnchorElement> = React.createRef();

  return (
    <SideBar>
      <SideBar.ToggleTrigger>
        {({ toggleSideBar, open }) => {
          const className: string = open
            ? `${styles.burger} ${styles["open"]}`
            : `${styles.burger}`;
          return (
            <button
              className={styles.toggleButton}
              onClick={toggleSideBar}
              aria-label="toggle sidebar menu"
            >
              <Burger className={className} />
            </button>
          );
        }}
      </SideBar.ToggleTrigger>
      <SideBar.Content>
        {({ closeSideBar, transitionStatus }) => (
          <>
            <nav className={`${styles.sideBar} ${styles[transitionStatus]}`}>
              <div>Create new component for actual contnet here</div>
            </nav>
            <Overlay
              close={closeSideBar}
              className={`${styles.overlay} ${styles[transitionStatus]}`}
            />
          </>
        )}
      </SideBar.Content>
    </SideBar>
  );
};
