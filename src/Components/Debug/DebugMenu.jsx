import { React, useRef } from "react";
import styles from "./DebugMenu.module.css";
import { setNetworkActive, setTime } from "../../server";

function DebugMenu() {
  const ref_dropdown = useRef(null);

  function showDropdown() {
    ref_dropdown.current.classList.toggle(styles.closed);
  }

  function onNetworkSpeedChange(evnt) {
    let num = parseInt(evnt.target.value);
    setTime(num);
  }

  function toggleNetworkActive(evnt) {
    const isChecked = evnt.target.checked;
    setNetworkActive(isChecked);
  }

  return (
    <div id="debug-menu">
      <button className={styles.btn} onClick={showDropdown}>
        <div className="material-symbols-outlined">settings</div>
      </button>
      <div className={`${styles.dropdown} ${styles.closed}`} ref={ref_dropdown}>
        <div>
          <label htmlFor="network-speed">Network Speed</label>
          <input
            className={styles.network_speed}
            id="network-speed"
            type="number"
            min="0"
            placeholder="1 second"
            onChange={onNetworkSpeedChange}
          />
        </div>
        <div>
          <label htmlFor="toggle">Set Network Active</label>
          <input
            className={styles.toggle}
            id="toggle"
            type="checkbox"
            defaultChecked
            onChange={toggleNetworkActive}
          />
        </div>
      </div>
    </div>
  );
}

export default DebugMenu;
