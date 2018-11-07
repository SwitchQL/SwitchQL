import React from 'react';
import styles from "./styles.css";


const Table = () => {
  return (
    <div className={styles.tableText}>
      <div className={styles.areaOneBox}>
        <textarea className={styles.areaOne}></textarea>
      </div>
      <div className={styles.areaTwoBox}>
        <textarea className={styles.areaTwo}></textarea>
      </div>
    </div>
    )
}

export default Table;