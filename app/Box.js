import React, {useState, useEffect, useContext} from "react";
import styles from "./page.module.css";
import { APIContext } from "./APIHandler";

function Box({ id, state, onClick }) {
  const { dimensions } = useContext(APIContext);

  const getBackgroundColor = (state) => {
    switch (state) {
      case "path":
        return "black";
      case "open":
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
    backgroundColor: getBackgroundColor(state),
    width: dimensions ? dimensions.boxSize : 0,
    height: dimensions ? dimensions.boxSize : 0,
  };

  return <div className={styles.box} style={boxStyles} onClick={() => onClick(id)}></div>;
}

export default Box;