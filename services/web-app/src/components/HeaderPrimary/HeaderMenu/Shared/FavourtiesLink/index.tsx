import React from "react";
import { Link } from "react-router-dom";
import styles from "./style.module.scss";

export default () => (
  <Link
    className={styles.link}
    title="Go to your favourites section"
    to="/changeme"
  >
    <svg className={styles.icon} aria-labelledby="fav-icon-title">
      <title id="fav-icon-title">Go to the favourites section</title>
      <use xlinkHref="../../../../../public/sprite.svg#icon-heart-o" />
    </svg>
  </Link>
);
