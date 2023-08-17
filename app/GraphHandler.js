'use client'

import React, { createContext, useState } from "react";

export const GraphContext = createContext();

export const GraphProvider = ({ children }) => {
    const [graph, setGraph] = useState(nodeGraph);
    const [path, setPath] = useState([]); // Add initial empty path
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [wall, setWall] = useState(null);
    const [isWall, setIsWall] = useState(false);

    const handleStart = (value) => { setStart(nodeGraph[value]); };
    const handleEnd = (value) => { setEnd(nodeGraph[value]); };
    const handleWall = (value) => { setWall(nodeGraph[value]); };

    const calculateShortestPath = () => {
    const shortestPath = Dijkstra(graph, start, end); setPath(shortestPath);
    };

    return <GraphContext.Provider value={{ 
        graph, setGraph, path, calculateShortestPath, 
        handleStart, handleEnd, handleWall 
    }}>{children}</GraphContext.Provider>;
};

const boxSize = 25;
const boxHandlerHeight = 700;
const boxHandlerWidth = 1200;
const rows = Math.floor(boxHandlerHeight / boxSize);
const columns = Math.floor(boxHandlerWidth / boxSize);

class Node {
    constructor(id, value) {
      this.id = id;
      this.value = value;
      this.links = [];
      this.previousNode = null;
    }
  
    addLink(targetNode, linkValue) {
      this.links.push({ target: targetNode, value: linkValue });
    }
}
  
function InitializeBlankGraph(rows, columns) {
const nodeGraph = [];
for( let i=0; i < rows; i++ ) {
    for( let j=0; j < columns; j++ ) {
        const node = new Node( i * columns + j, null );
        nodeGraph.push(node);
    }
}
return nodeGraph;
}

function InitializeGraphLinkWeights(nodeGraph, rows, columns) {
for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
    const nodeIndex = i * columns + j;
    const node = nodeGraph[nodeIndex];

    // Initialize links here based on the node's position
    if (i > 0) {
        const upperNodeIndex = (i - 1) * columns + j;
        node.addLink(nodeGraph[upperNodeIndex], 1);
    }
    if (i < rows - 1) {
        const lowerNodeIndex = (i + 1) * columns + j;
        node.addLink(nodeGraph[lowerNodeIndex], 1);
    }
    if (j > 0) {
        const leftNodeIndex = i * columns + (j - 1);
        node.addLink(nodeGraph[leftNodeIndex], 1);
    }
    if (j < columns - 1) {
        const rightNodeIndex = i * columns + (j + 1);
        node.addLink(nodeGraph[rightNodeIndex], 1);
    }
    }
}
}  
  
const nodeGraph = InitializeBlankGraph(rows, columns);
InitializeGraphLinkWeights(nodeGraph, rows, columns);

export function MatchGrapToArrayState(graph, array) {
    let startNode = null;
    let endNode = null;
  
    const newArray = array.map((box) => {
      const node = graph[box.id];
  
      if (box.state === "start") {
        startNode = node;
        return { ...box, state: "start" };
      } else if (box.state === "end") {
        endNode = node;
        return { ...box, state: "end" };
      } else if (box.state === "wall") {
        // Set link values to Infinity for walls
        node.links.forEach(link => {
          link.target.links.find(t => t.target === node).value = Infinity;
        });
        return { ...box, state: "wall" };
      } else {
        return { ...box, state: "path" };
      }
    });
  
    return { newArray, startNode, endNode };
}  
  

function Dijkstra(nodeGraph, start, end){
    for (const node of nodeGraph) {
        if (node === start) {
            node.value = 0;
        } else {
            node.value = Infinity;
        }
        node.previousNode = null;
    }

    const unvisitedNodes = nodeGraph.slice();

    while (unvisitedNodes.length > 0) {
        const currentNode = unvisitedNodes.sort((nodeA, nodeB) => nodeA.value - nodeB.value).shift();
        if (currentNode === end) break; // Break if we reached the end node
        if (currentNode.value === Infinity) break;

        for (const { target, value } of currentNode.links) {
            const distance = currentNode.value + value;
            if (distance < target.value) {
                target.value = distance;
                target.previousNode = currentNode;
            }
        }
    }

    const path = [];
    let currentNode = end;
    while (currentNode) {
        path.unshift(currentNode.id);
        currentNode = currentNode.previousNode;
    }
    return path;
}