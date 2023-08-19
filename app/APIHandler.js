"use client"
import React, { createContext, useState, useEffect } from 'react';
import UIRenderer from './UIRenderer';

const APIContext = createContext();

const calculateDimensions = () => {
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

    return { numRows, numColumns };
};

function APIProvider({ children }) {
    // Ideally this would be linked to the actual logic handler, but that would make it refresh everytime the dimensions change
    // Too much to handle right now
    const [dimensions, setDimensions] = useState(null);
    const [boxArray, setBoxArray] = useState([]);

    useEffect(() => {
    const { rows, cols } = calculateDimensions();
    setDimensions({ rows, cols });
    initializeGraphs({ rows, cols });
    }, []);

    function initializeGraphs() {
        //API POST request
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Instruction': 'initializeGraphs'
            },
            body: dimensions
        };

        fetch('/api/routes', requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setBoxArray(data);
            });
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
