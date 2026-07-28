import React from "react";
import styles from "../CSS/PageLoader.module.css";

export default function PageLoader({ message = "Loading..." }) {
  return (
    <div className={styles.pageLoader}>
      <div className={styles.loaderContent}>
        <div className={styles.dotsContainer}>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
        </div>
        <p className={styles.loadingText}>{message}</p>
      </div>
    </div>
  );
}