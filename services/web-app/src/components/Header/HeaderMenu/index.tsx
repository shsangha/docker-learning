import React, { Suspense } from "react";
import { Link } from "react-router-dom";
import AuthCheckHOC from "../../AuthCheckHOC";
import ScreenWidthHOC from "../../ScreenWidthHOC";
import { Props } from "./types";
import Burger from "./SideBar/burger";
import styles from "./style.module.scss";

const SideBarComponent = React.lazy(() => import("./SideBar"));
const ModalComponent = React.lazy(() => import("./AuthModal"));

const SideBar = () => (
  <Suspense fallback={<Burger className={styles.burger} />}>
    <SideBarComponent />
  </Suspense>
);

const Modal = () => (
  <Suspense fallback={<div>Login/Signup</div>}>
    <ModalComponent />
  </Suspense>
);

const MyGrails = () => (
  <Link aria-label="go to my grails" to="/mygrails">
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width="35"
      height="35"
      viewBox="0 0 28 28"
      role="img"
    >
      <title>heart</title>
      <path d="M14 26c-0.25 0-0.5-0.094-0.688-0.281l-9.75-9.406c-0.125-0.109-3.563-3.25-3.563-7 0-4.578 2.797-7.313 7.469-7.313 2.734 0 5.297 2.156 6.531 3.375 1.234-1.219 3.797-3.375 6.531-3.375 4.672 0 7.469 2.734 7.469 7.313 0 3.75-3.437 6.891-3.578 7.031l-9.734 9.375c-0.187 0.187-0.438 0.281-0.688 0.281z" />
    </svg>
  </Link>
);

const CommonMenuItems = () => (
  <>
    <Link to="/shop">shop</Link>
    <Link to="/sell">sell</Link>
    <Link to="/read">read</Link>
  </>
);

const HeaderMenu = ({ authenticated, windowWidth }: Props) => (
  <div className={styles.headerMenu}>
    {(() => {
      if (windowWidth < 1000) {
        return authenticated ? (
          <>
            <MyGrails />
            <SideBar />
          </>
        ) : (
          <>
            <Modal />
            <SideBar />
          </>
        );
      }
      return !authenticated ? (
        <>
          <CommonMenuItems />
          <MyGrails />
          <div className={styles.dropDown}>
            <span>mouse over me</span>
            <div className={styles.dropDownContent}>
              <p>test link info</p>
            </div>
          </div>
        </>
      ) : (
        <>
          <CommonMenuItems />
          <Modal />
        </>
      );
    })()}
  </div>
);

export default AuthCheckHOC(ScreenWidthHOC(HeaderMenu));
