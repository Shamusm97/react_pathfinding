'use client'
import React from "react";
import styles from "./page.module.css";

function Box({ id, state, setBoxState }) {
  const getBackgroundColor = (state) => {
    switch (state) {
      case "path":
        return "white";
      case "start":
        return "green";
      case "end":
        return "red";
      case "wall":
        return "gray";
      default:
        return "purple"; // Default to white if state is not recognized
    }
  };

  const boxStyles = {
    backgroundColor: getBackgroundColor(state)
  };

  const handleBoxClick = () => {
    let newState = "";

    switch (state) {
      case "path":
        newState = "start";
        break;
      case "start":
        newState = "end";
        break;
      case "end":
        newState = "wall";
        break;
      case "wall":
        newState = "path";
        break;
      default:
        newState = "path";
        break;
    }

    setBoxState(id, newState);
  };

  return <div className={styles.box} style={boxStyles} onClick={handleBoxClick}></div>;
}

export default Box;
