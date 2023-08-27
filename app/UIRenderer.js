"use client"
import React, { useContext } from 'react';
import { APIContext } from './APIHandler';
import styles from './page.module.css';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import BoxRenderer from './BoxGraphRenderer';

const Header = () => {
    return (
        <header className={styles.header}>
            <p className={styles.title}>Pathfinding!</p>
        </header>
    );
};

const Footer = () => {
    const { runDijkstra, runAStar, reset, generateRandomWalls, sliderValue, setSliderValue } = useContext(APIContext);

    const handleSliderChange = (event, newValue) => {
        setSliderValue(newValue);
    }

    return (
        <div className={styles.footer}>
            <Button className={styles.resetButton} variant="contained" onClick={reset}> Reset </Button>
            <div className={styles.pathfindingButtons}>
                <Button variant="contained" onClick={runDijkstra}> Dijkstra's Algorithm </Button>
                <Button variant="contained" onClick={runAStar}> A* Alogrithm </Button>
            </div>
            <div className={styles.wallUI}>
                <Button variant="contained" onClick={generateRandomWalls}> Generate Walls </Button>
                <Slider className={styles.slider} 
                        value={sliderValue}
                        onChange={handleSliderChange} 
                        aria-label="Small" 
                        valueLabelDisplay="auto" 
                        max={30} />
            </div>
        </div>
    );
};

const UIRenderer = () => {
    const { dimensions } = useContext(APIContext);

    if (!dimensions) {
        return null; // Render nothing until dimensions are calculated
    } else {
        return (
            <div>
                <Header />
                <BoxRenderer />
                <Footer/>
            </div>
        );
    };
};

export default UIRenderer;