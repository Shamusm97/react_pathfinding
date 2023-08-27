"use client"
import React, { createContext, useState, useEffect } from 'react';
import styles from './page.module.css';

const APIContext = createContext();

const calculateDimensions = async () => {
    let boxSize, boxRendererWidth, boxRendererHeight, numRows, numColumns;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    switch (true) {
        case windowWidth > 1200:
        boxSize = 25;
        boxRendererWidth = 1200;
        break;
        case windowWidth > 900:
        boxSize = 20;
        boxRendererWidth = 900;
        break;
        case windowWidth > 600:
        boxSize = 15;
        boxRendererWidth = 600;
        break;
        default:
        boxSize = 10;
        boxRendererWidth = boxRendererWidth;
    }

    boxRendererHeight = windowHeight - 100;

    numRows = Math.floor(boxRendererHeight / boxSize);
    boxRendererHeight = Math.floor(numRows * boxSize);
    numColumns = Math.floor(boxRendererWidth / boxSize);

    return { rows: numRows, columns: numColumns,
             boxRendererWidth: boxRendererWidth,
             boxRendererHeight: boxRendererHeight, 
             boxSize: boxSize };
};

function APIProvider({ children }) {

    // Create 'global' context state variables for the dimensions and boxGraph
    const [dimensions, setDimensions] = useState(null);
    const [boxGraph, setBoxGraph] = useState([]);
    const [sliderValue, setSliderValue] = useState(30);

    // Fetch the dimensions of the screen and set the state variable
    useEffect(() => {
        async function fetchDimensions() {
            const dimensions = await calculateDimensions();
            setDimensions(dimensions);
        }
        fetchDimensions();
    }, []);

    async function runDijkstra() {
        const requestOptions = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Instruction': 'runDijkstra'
            },
            body: JSON.stringify({ boxGraph: boxGraph }),
        };

        try {
            const response = await fetch('/api', requestOptions);
            const path = await response.json();
            animateShowPath(path);
            return path;
        } catch (error) {
            console.error("Error: ", error);
        }

    }

    async function runAStar() {
        const requestOptions = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Instruction': 'runAStar'
            },
            body: JSON.stringify({ boxGraph: boxGraph }),
        };

        try {
            const response = await fetch('/api', requestOptions);
            const path = await response.json();
            animateShowPath(path);
            return path;
        } catch (error) {
            console.error("Error: ", error);
        }
    }

    const reset = () => {
        setBoxGraph((prevBoxGraph) => {
            const updatedBoxGraph = prevBoxGraph.boxGraph.map((box) => {
                return { ...box, state: "open" };
            });
            return { ...prevBoxGraph, boxGraph: updatedBoxGraph };
        });
    }

    const slider = (event, newSliderValue) => {
        setSliderValue(newSliderValue);
    }

    const generateRandomWalls = () => {
        reset();
        setBoxGraph((prevBoxGraph) => {
            const updatedBoxGraph = prevBoxGraph.boxGraph.map((box) => {
                if (box.state === "open" && Math.random() < sliderValue / 100) {
                    return { ...box, state: "wall" };
                }
                return box;
            });
            return { ...prevBoxGraph, boxGraph: updatedBoxGraph };
        });
    }

    const showPath = (path) => {
    setBoxGraph((prevBoxGraph) => {
        const updatedBoxGraph = prevBoxGraph.boxGraph.map((box) => {
        if (path.includes(box.id)) {
            return { ...box, state: "path" };
        } else if (box.state === "path") {
            return { ...box, state: "open" };
        }
        return box;
        });
        return { ...prevBoxGraph, boxGraph: updatedBoxGraph };
    });
    };
    
    const animateShowPath = (path) => {
    let i = 0;
    const interval = setInterval(() => {
        if (i >= path.length) {
        clearInterval(interval);
        return;
        }
        showPath(path.slice(0, i + 1));
        i++;
    }, 50);
    };

    // Create the shared data object
    const sharedData = {
        dimensions: dimensions,
        boxGraph: boxGraph,
        setBoxGraph: setBoxGraph,
        reset: reset,
        sliderValue: sliderValue,
        setSliderValue: setSliderValue,
        runAStar: boxArray => runAStar(boxArray),
        runDijkstra: boxArray => runDijkstra(boxArray),
        generateRandomWalls: () => generateRandomWalls(),
        reset: () => reset()
    };

  return (
    <APIContext.Provider value={sharedData}>{children}</APIContext.Provider>
  );
}

export { APIContext, APIProvider };
