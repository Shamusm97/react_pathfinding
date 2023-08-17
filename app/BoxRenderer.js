'use client'
import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import Box from "./Box";

function ParentComponent() {

  const rows = Math.floor(700 / 25);
  const columns = Math.floor(1200 / 25);

  const [boxArray, setBoxArray] = useState([]);

  // Perform API call to fetch the initial graph data
  useEffect(() => { fetchBlankGraph(); }, []); // Empty dependency array to ensure the effect runs only once

  function fetchBlankGraph() {
    const fetchGraph = async () => {
      const response = await fetch("/api/graph");
      const graph = await response.json();
      
      // Initialize boxArray based on the graph data
      const initialBoxArray = graph.map(node => ({
        id: node.id, // Use the ID from the graph data
        state: "path" // Initialize each box as "path"
      }));
      
      setBoxArray(orderBoxes(initialBoxArray, rows, columns));
    };

    fetchGraph();
  };


  const setBoxState = (boxId, newState) => {
    // Check if there's already a start or end box
    const hasStart = boxArray.some(box => box.state === "start");
    const hasEnd = boxArray.some(box => box.state === "end");
  
    let updatedState = newState;
  
    if (newState === "start" && hasStart) {
      // Skip adding another start box, go to the next state
      updatedState = hasEnd ? "path" : "end"; // If there's an end, go to "path", else go to "end"
    } else if (newState === "end" && hasEnd) {
      // Skip adding another end box, go to the next state
      updatedState = "path";
    }
  
    const updatedBoxArray = boxArray.map((box) =>
      box.id === boxId ? { ...box, state: updatedState } : box
    );
    setBoxArray(updatedBoxArray);
  };  
  
  const handleFunction = async () => {
    const response = await fetch("/api/graph", {
      method: "POST", // Set the HTTP method to POST
      body: JSON.stringify({boxArray}) // Provide any data you want to send in the body
    });
    
    let path = await response.json(); // Will be automatically JSON serialized
    showPath(boxArray, path)
  };
  
  function showPath(boxArray, path) {
    const updatedBoxArray = boxArray.map((box) => {
      if (path.includes(box.id) && box.state !== "start" && box.state !== "end") {
        return { ...box, state: "show_path" };
      }
      return box;
    });
    setBoxArray(updatedBoxArray);
  }  

  function generateRandomWalls(totalCount, wallPercentage) {
    const wallCount = Math.floor((wallPercentage / 100) * totalCount); // Calculate the number of walls based on the percentage
    const wallIndices = [];
  
    // Generate random unique indices for walls
    while (wallIndices.length < wallCount) {
      const randomIndex = Math.floor(Math.random() * totalCount);
      if (!wallIndices.includes(randomIndex)) {
        wallIndices.push(randomIndex);
      }
    }
  
    // Create an array representing your objects with walls
    const objectsWithWalls = boxArray.map((box, index) => ({
      ...box,
      state: wallIndices.includes(index) ? "wall" : "path"
    }));
  
    setBoxArray(objectsWithWalls);
  }
  

  function orderBoxes(boxArray, rows, columns) {
    const orderedBoxes = [];
    
    for (let i = rows - 1; i >= 0; i--) {
      for (let j = 0; j < columns; j++) {
        const boxIndex = i * columns + j; // Calculate the index for the current box
        orderedBoxes.push(boxArray[boxIndex]);
      }
    }
    
    return orderedBoxes;
  }  
  
  return (
    <div>
      <div className={styles.boxhandler}>
        {boxArray.map((box) => (
          <Box
            key={box.id}
            id={box.id}
            state={box.state}
            setBoxState={setBoxState}
          />
        ))}
      </div>
      <button onClick={handleFunction}>Dijkstra's Algorithm</button>
      <button onClick={fetchBlankGraph}>Reset</button>
      <button onClick={() => generateRandomWalls(rows * columns, 30)}> Generate Random Walls </button>
    </div>
  );
}

export default ParentComponent;
