"use client"
import React, { useContext } from 'react';
import { APIContext } from './APIHandler';
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

const Footer = () => {
    const { performDijkstra, performAStar, initializeGraphs } = useContext(APIContext);

    return (
        <div className={styles.bottomUI}>
        <Button variant="contained" onClick={performDijkstra}> Dijkstra's Algorithm </Button>
        <Button variant="contained" onClick={initializeGraphs}> Initialize Graphs </Button>
        <Button variant="contained" onClick={performAStar}> A Star Alogrithm </Button>
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