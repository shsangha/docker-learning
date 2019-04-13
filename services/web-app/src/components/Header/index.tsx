import React from "react";
import styles from "./style.module.scss";
import HeaderMenu from "./HeaderMenu";
import SearchBar from "./SearchBar";

export default () => (
  <nav className={styles.header}>
    <SearchBar />
    <a aria-label="Go to homepage" className={styles.logo} href="/">
      <svg
        className={styles.logoSVG}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 223 46.85"
        height={0}
        role="img"
      >
        <text
          transform="translate(0 31.01)"
          fontSize="36"
          fill="#231f20"
          fontFamily="LucidaSansUnicode, Lucida Sans Unicode"
        >
          G R A I L E D
        </text>
      </svg>
    </a>
    <HeaderMenu />
  </nav>
);
