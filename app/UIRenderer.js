"use client"
import React, { useState, useRef, useEffect } from 'react';
import styles from './page.module.css';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import BoxRenderer from './BoxRenderer';

// calculate the number of rows and columns based on the screen size
// this is a bit of a hack, but it works for now
// TODO: make this more robust
const calculateDimensions = () => {
    let boxSize = 0;
    let screenWidth = window.innerWidth;
    let screenHeight = window.innerHeight;

    if (screenWidth > 1200) {
        boxSize = 25;
        screenWidth = 1200;
        screenHeight = 700;
    } else if (screenWidth > 900) {
        boxSize = 20;
        screenWidth = 900;
        screenHeight = 700;
    } else if (screenWidth > 600) {
        boxSize = 15;
        screenWidth = 600;
        screenHeight = 700;
    } else {
        boxSize = 10;
    }

    const rows = Math.floor(screenHeight / boxSize);
    const columns = Math.floor(screenWidth / boxSize);
    console.log('Screen Size: ', screenWidth, screenHeight)
    console.log(`Rows: ${rows}, Columns: ${columns}, Box Size: ${boxSize}`);
    return { rows, columns, boxSize };
};

const Header = () => {
  return (
    <header className={styles.header}>
      <p className={styles.title}>Hello World!</p>
    </header>
  );
};

const Footer = ({ wallRandomness, slider, performDijkstra, fetchBlankGraph, generateRandomWalls, dimensions, performAStar, generateMaze }) => {
    return (
      <div className={styles.bottomUI}>
        <Button variant="contained" onClick={performDijkstra}> Dijkstra's Algorithm </Button>
        <Button variant="contained" onClick={fetchBlankGraph}> Reset </Button>
        <Button variant="contained" onClick={() => performAStar()}> A Star Alogrithm </Button>
        <Button variant="contained" onClick={() => generateMaze()}> Generate A Maze </Button>
        <div className={styles.randomnessUI}>
          <Button variant="contained" onClick={() => generateRandomWalls(dimensions.rows * dimensions.columns)}> Generate Random Walls </Button>
          <Slider
            className={styles.slider}
            min={0}
            max={30}
            aria-label="Wall Randomness"
            value={wallRandomness}
            onChange={slider}
          />
        </div>
      </div>
    );
};

const UIRenderer = () => {
    const boxRendererRef = useRef(null);
    const [wallRandomness, setWallRandomness] = useState(30);
    const [dimensions, setDimensions] = useState(null);

    useEffect(() => {
      const calculatedDimensions = calculateDimensions();
      setDimensions(calculatedDimensions);
    }, []);

    const performDijkstra = () => {
        if (boxRendererRef.current) {
            boxRendererRef.current.performDijkstra();
        }
    };

    const fetchBlankGraph = () => {
        if (boxRendererRef.current) {
            boxRendererRef.current.fetchBlankGraph();
        }
    };
    
    const generateRandomWalls = (totalCount) => {
        if (boxRendererRef.current) {
            boxRendererRef.current.generateRandomWalls(totalCount);
        }
    };

    const performAStar = (start, end) => {
        if (boxRendererRef.current) {
            boxRendererRef.current.performAStar(start, end);
        }
    };

    const generateMaze = () => {
        if (boxRendererRef.current) {
            boxRendererRef.current.generateMaze();
        }
    }

    const slider = (event, newValue) => {
        setWallRandomness(newValue);
    };

    if (!dimensions) {
        return null; // Render nothing until dimensions are calculated
    }

    return (
        <div>
            <Header />
            <BoxRenderer
            ref={boxRendererRef} 
            wallRandomness={wallRandomness}
            dimensions={dimensions} />
            <Footer
            dimensions={dimensions}
            slider={slider}
            wallRandomness={wallRandomness} 
            performDijkstra={performDijkstra} 
            fetchBlankGraph={fetchBlankGraph} 
            generateRandomWalls={generateRandomWalls}
            performAStar={performAStar}
            generateMaze={generateMaze} />
        </div>
    );
};

export default UIRenderer;