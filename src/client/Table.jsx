import React from 'react';
import styles from "./styles.css";


const Table = (props) => {
  return (
    <div className={styles.tableText}>
      <div className={styles.areaOneBox}>
        <textarea className={styles.areaOne} readOnly value={props.textLeft}></textarea>
      </div>
      <div className={styles.areaTwoBox}>
        <textarea className={styles.areaTwo} readOnly value={props.textRight}></textarea>
      </div>
    </div>
    )
}

export default Table;