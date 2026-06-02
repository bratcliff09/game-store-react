import React, { useRef } from "react";
import styles from "./TryAgain.module.css";

function TryAgain(props) {
  const ref_btn = useRef(null);
  async function fn() {
    ref_btn.current.disabled = true;
    await props.tryAgain();
    ref_btn.current.disabled = false;
  }
  return (
    <div className={styles.networkError}>
      <p>Could not connect to server</p>
      <button onClick={fn} ref={ref_btn}>
        Try Again
      </button>
    </div>
  );
}

export default TryAgain;
