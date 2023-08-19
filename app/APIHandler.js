"use client"
import React, { createContext, useState, useEffect } from 'react';

const APIContext = createContext();

const calculateDimensions = async () => {
    let boxSize, screenWidth, numRows, numColumns;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    switch (true) {
        case windowWidth > 1200:
        boxSize = 25;
        screenWidth = 1200;
        break;
        case windowWidth > 900:
        boxSize = 20;
        screenWidth = 900;
        break;
        case windowWidth > 600:
        boxSize = 15;
        screenWidth = 600;
        break;
        default:
        boxSize = 10;
        screenWidth = windowWidth;
    }

    numRows = Math.floor(windowHeight / boxSize);
    numColumns = Math.floor(screenWidth / boxSize);

    return { rows: numRows, columns: numColumns };
};

function APIProvider({ children }) {
    // Ideally this would be linked to the actual logic handler, but that would make it refresh everytime the dimensions change
    // Too much to handle right now
    const [dimensions, setDimensions] = useState(null);
    const [boxGraph, setBoxGraph] = useState([]);

    useEffect(() => {
        async function fetchDimensions() {
            const { rows, columns } = await calculateDimensions();
            console.log("Dimensions calculated to ", rows, columns);
            setDimensions({ rows, columns });
        }
        fetchDimensions();
    }, []);

    useEffect(() => {
        if (dimensions !== null) {
            initializeGraphs(dimensions);
        }
    }, [dimensions]);

    async function initializeGraphs() {
        console.log("Initializing graphs");
        const requestOptions = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Instruction': 'initializeGraphs'
            },
            body: JSON.stringify({ dimensions: dimensions }),
        };

        try {
            const response = await fetch('/api', requestOptions);
            const boxGraph = await response.json();
            console.log("BoxGraph: ", boxGraph);
            setBoxGraph(boxGraph);
            return boxGraph;
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    function performDijkstra(boxArray) {
        //POST request
    }

    function performAStar(boxArray) {
        //POST request
    }

    function reset() {
    }

    const sharedData = {
        dimensions: dimensions,
        initializeGraphs: () => initializeGraphs(),
        performDijkstra: boxArray => performDijkstra(boxArray),
        performAStar: boxArray => performAStar(boxArray),
        reset: () => reset()
    };

  return (
    <APIContext.Provider value={sharedData}>{children}</APIContext.Provider>
  );
}

export { APIContext, APIProvider };
