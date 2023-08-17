"use client"
import React, { useState, useRef } from 'react';
import styles from './page.module.css';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import BoxRenderer from './BoxRenderer';

const Header = () => {
  return (
    <header className={styles.header}>
      <p className={styles.title}>Hello World!</p>
    </header>
  );
};

const Footer = ({ wallRandomness, slider, performDijkstra, fetchBlankGraph, generateRandomWalls }) => {
    return (
      <div className={styles.bottomUI}>
        <Button variant="contained" onClick={performDijkstra}>
          Dijkstra's Algorithm
        </Button>
        <Button variant="contained" onClick={fetchBlankGraph}>
          Reset
        </Button>
        <div className={styles.randomnessUI}>
          <Button variant="contained" onClick={() => generateRandomWalls(700/25 * 1200/25)}>
            Generate Random Walls
          </Button>
          <p>Wall Randomness</p>
          <p>{wallRandomness}</p>
          <Slider
            className={styles.slider}
            min={0}
            max={100}
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

    const slider = (event, newValue) => {
        setWallRandomness(newValue);
    };

    return (
        <div>
            <Header />
            <BoxRenderer ref={boxRendererRef} wallRandomness={wallRandomness} />
            <Footer 
            slider={slider}
            wallRandomness={wallRandomness} 
            performDijkstra={performDijkstra} 
            fetchBlankGraph={fetchBlankGraph} 
            generateRandomWalls={generateRandomWalls} />
        </div>
    );
};

export default UIRenderer;