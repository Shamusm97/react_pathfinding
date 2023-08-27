import React, { useState, useEffect, useContext } from "react";
import styles from "./page.module.css";
import Box from "./Box";
import { APIContext } from './APIHandler';

const BoxRenderer = () => {
  const { dimensions, boxGraph, setBoxGraph } = useContext(APIContext);
  const [isLoading, setIsLoading] = useState(true);
  const boxStates = ["wall", "start", "end", "open"];

  useEffect(() => {
    if (dimensions) {
      const newBoxGraph = initializeBoxGraph(dimensions);
      setBoxGraph(newBoxGraph);
      setIsLoading(false);
      console.log(dimensions);
    }
  }, [dimensions]);

  function initializeBoxGraph(dimensions) {
    const boxGraph = [];
    for (let row = 0; row < dimensions.rows; row++) {
      for (let column = 0; column < dimensions.columns; column++) {
        boxGraph.push({
          id: row * dimensions.columns + column,
          state: "open"
        });
      }
    }
    return { dimensions, boxGraph };
  };

  const handleBoxClick = (boxId) => {
    setBoxGraph((prevBoxGraph) => {
      const updatedBoxGraph = prevBoxGraph.boxGraph.map((box) => {
        if (box.id === boxId) {
          const currentState = box.state;
  
          // Determine the next state based on the order of boxStates
          const nextStateIndex = (boxStates.indexOf(currentState) + 1) % boxStates.length;
          let nextState = boxStates[nextStateIndex];
  
          // Check if there is already a "start" or "end" state
          const startExists = prevBoxGraph.boxGraph.some((b) => b.state === "start");
          const endExists = prevBoxGraph.boxGraph.some((b) => b.state === "end");
  
          // Adjust the next state based on the presence of "start" and "end"
          if (nextState === "start" && startExists) {
            nextState = "end";
          }
          if (nextState === "end" && endExists) {
            nextState = "open";
          }
  
          return { ...box, state: nextState };
        }
        return box;
      });
  
      return { ...prevBoxGraph, boxGraph: updatedBoxGraph };
    });
  };  

  const boxRendererStyles = {
    width: dimensions ? dimensions.boxRendererWidth: 0,
    height: dimensions ? dimensions.boxRendererHeight: 0,
  };

  return (
    <div className={styles.boxRenderer} style={boxRendererStyles}>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        boxGraph.boxGraph.map(box => (
          <Box
            key={box.id}
            id={box.id}
            state={box.state}
            onClick={handleBoxClick}
          />
        ))
      )}
    </div>
  );
};

export default BoxRenderer;