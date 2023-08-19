"use client"
import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import styles from "./page.module.css";
import Box from "./Box";

const BoxRenderer = forwardRef((props, ref) => {

  const [boxArray, setBoxArray] = useState([]);
  const [stepCount, setStepCount] = useState(0);

  // Perform API call to fetch the initial graph data
  useEffect(() => { fetchBlankGraph(); }, []); // Empty dependency array to ensure the effect runs only once

  function fetchBlankGraph() {
    const fetchGraph = async () => {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Instruction': 'InitializeBlankGraph'
        },
        body: JSON.stringify({ dimension: props.dimensions }),
      };
  
      try {
        const response = await fetch("/api/graph", requestOptions);
        
        if (!response.ok) {
          throw new Error(`Failed to initialize blank graph. Status: ${response.status}`);
        }
        
        const graph = await response.json();
  
        // Initialize boxArray based on the graph data
        const initialBoxArray = graph.map(node => ({
          id: node.id, // Use the ID from the graph data
          state: "path" // Initialize each box as "path"
        }));
  
        setBoxArray(orderBoxes(initialBoxArray, props.dimensions.rows, props.dimensions.columns));
      } catch (error) {
        console.error('Error fetching graph:', error);
      }
    };
  
    fetchGraph();
  }  

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
  
  const performDijkstra = async () => {
    try {
      const response = await fetch("/api/graph", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Instruction": "RunDijkstra"
        },
        body: JSON.stringify({ boxArray }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch path data. Status: ${response.status}`);
      }
  
      const path = await response.json();
  
      if (!Array.isArray(path)) {
        throw new Error("Invalid path data received from the server");
      }
  
      animatePath(path);
    } catch (error) {
      console.error("Error performing Dijkstra:", error);
      // Handle or display the error as needed
    }
  };
  
  const performAStar = async () => {
    try {
      const response = await fetch("/api/graph", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Instruction": "RunAStar"
        },
        body: JSON.stringify({ boxArray: boxArray }),
      });

      if (!response.ok) {
        throw new Error(`Failed to run A Star. Status: ${response.status}`);
      }

      const path = await response.json();
      animatePath(path);
    } catch (error) {
      console.error("Error running A Star:", error);
      // Handle or display the error as needed
    }
  };

  function showPath(boxArray, path) {
    const updatedBoxArray = boxArray.map((box) => {
      if (box.state === "show_path" && !path.includes(box.id)) {
        return { ...box, state: "path" };
      };
      if (box.state === "start" || box.state === "end") return box; // Skip start and end boxes (don't change their state
      if (path.includes(box.id)) {
        return { ...box, state: "show_path" };
      }
      return box;
    });
    setBoxArray(updatedBoxArray);
  }

  function animatePath(path) {
    for (let i = 0; i < path.length; i++) {
      setTimeout(() => {
        setStepCount(i + 1);
        showPath(boxArray, path.slice(0, i + 1));
      }, 50 * i);
    }
  }  

  function generateRandomWalls(totalCount) {
    const wallCount = Math.floor((props.wallRandomness / 100) * totalCount); // Calculate the number of walls based on the percentage
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

  function generateMaze() {
    const fetchMaze = async () => {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Instruction': 'GenerateMaze'
        }
      };
  
      try {
        const response = await fetch("/api/graph", requestOptions);
        
        if (!response.ok) {
          throw new Error(`Failed to generate maze. Status: ${response.status}`);
        }
        
        const maze = await response.json();
  
        // Initialize boxArray based on the graph data
        const initialBoxArray = maze.map(node => ({
          id: node.id, // Use the ID from the graph data
          state: "path" // Initialize each box as "path"
        }));
  
        setBoxArray(initialBoxArray);
      } catch (error) {
        console.error('Error fetching graph:', error);
      }
    };
  
    fetchMaze();
  }

  function orderBoxes(boxArray) {
    const orderedBoxes = [];
    
    for (let i = props.dimensions.rows - 1; i >= 0; i--) {
      for (let j = 0; j < props.dimensions.columns; j++) {
        const boxIndex = i * props.dimensions.columns + j; // Calculate the index for the current box
        orderedBoxes.push(boxArray[boxIndex]);
      }
    }
    return orderedBoxes;
  }  

  useImperativeHandle(ref, () => ({
    performDijkstra,
    fetchBlankGraph,
    generateRandomWalls,
    performAStar,
    stepCount,
    generateMaze
  }));

  return (
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
  );
});

export default BoxRenderer;
