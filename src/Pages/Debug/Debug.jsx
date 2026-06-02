import React from "react";
import styles from "./Debug.module.css";

function Debug() {
  return (
    <main className={styles.main}>
      <title>Debug | GameStore</title>
      <h1>Debug Mode Explaination</h1>
      <div>
        <h2>How to Access</h2>
        <p>Click the gear in the header to display a drop down menu</p>
        <img src="debug_page/1.jpg" />
      </div>
      <div>
        <h2>Network Speed</h2>
        <p>Alters how long it takes before the network request completes.</p>
        <p>Useful for seeing the loading animations.</p>
        <img src="debug_page/2.jpg" />
      </div>
      <div>
        <h2>Set Network Active</h2>
        <p>Emulates an unreachable server.</p>
        <p>Causes the "Try Again" component to appear.</p>
        <div className={styles.flex}>
          <img src="debug_page/3.jpg" />
          <img src="debug_page/4.jpg" />
        </div>
        <img src="debug_page/5.jpg" />
      </div>
    </main>
  );
}

export default Debug;
