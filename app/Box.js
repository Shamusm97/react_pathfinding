"use client"

import React from "react";
import styles from "./page.module.css";

const boxStates = ["path", "wall", "start", "end"];

function Box({ id, state, setBoxState }) {
  const currentStateIndex = boxStates.indexOf(state);

  const getBackgroundColor = (state) => {
    switch (state) {
      case "show_path":
        return "black";
      case "path":
        return "white";
      case "start":
        return "green";
      case "end":
        return "red";
      case "wall":
        return "gray";
      default:
        return "purple"; // Default to purple if state is not recognized
    }
  };

  const boxStyles = {
    backgroundColor: getBackgroundColor(state)
  };

  const handleBoxClick = () => {
    const nextIndex = (currentStateIndex + 1) % boxStates.length;
    setBoxState(id, boxStates[nextIndex]);
  };

  return <div className={styles.box} style={boxStyles} onClick={handleBoxClick}></div>;
}

export default Box;
