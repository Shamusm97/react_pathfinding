class Node {
    constructor(id, value) {
        this.id = id;
        this.value = value;
        this.links = [];
        this.previousNode = null;
        this.state = "path";
    }

    addLink(targetNode, linkValue) {
        this.links.push({ target: targetNode, value: linkValue });
    }

    toJSON() {
        return {
            id: this.id,
            value: this.value,
            links: this.links.map(link => ({
                target: link.target.id // Serialize only the target node's id
            })),
            previousNodeId: this.previousNode ? this.previousNode.id : null,
            state: this.state
        };
    }
}

class NodeGraph {
    constructor() {
        this.nodes = [];
        this.dimensions = { rows: 0, columns: 0 };
        this.start = null;
        this.end = null;
    }

    addNode(node) {
        this.nodes.push(node);
    }

    validate() {
        const startNode = this.nodes.find(node => node.state === "start");
        const endNode = this.nodes.find(node => node.state === "end");
        if (!startNode || !endNode) {
            throw new Error("No start or end node found in graph");
        }
        this.start = startNode;
        this.end = endNode;
    }

    toJSON() {
        return this.nodes;
    }
}

function initializeNodeGraphFromBoxGraph(boxGraph) {
    const nodeGraph = new NodeGraph();
    nodeGraph.dimensions.rows = boxGraph.dimensions.rows;
    nodeGraph.dimensions.columns = boxGraph.dimensions.columns;
    for (let i = 0; i < boxGraph.boxGraph.length; i++) {
        const box = boxGraph.boxGraph[i];
        const node = new Node(box.id, null);
        node.state = box.state;
        nodeGraph.addNode(node);
    }
    return nodeGraph;
}

function initializeNodeGraphLinks(nodeGraph) {
    for (let i = 0; i < nodeGraph.dimensions.rows; i++) {
        for (let j = 0; j < nodeGraph.dimensions.columns; j++) {
            const nodeIndex = i * nodeGraph.dimensions.columns + j;
            const node = nodeGraph.nodes[nodeIndex];

            // Initialize links here based on the node's position
            if (i > 0) {
                const upperNodeIndex = (i - 1) * nodeGraph.dimensions.columns + j;
                node.addLink(nodeGraph.nodes[upperNodeIndex], 1);
            }
            if (i < nodeGraph.dimensions.rows - 1) {
                const lowerNodeIndex = (i + 1) * nodeGraph.dimensions.columns + j;
                node.addLink(nodeGraph.nodes[lowerNodeIndex], 1);
            }
            if (j > 0) {
                const leftNodeIndex = i * nodeGraph.dimensions.columns + (j - 1);
                node.addLink(nodeGraph.nodes[leftNodeIndex], 1);
            }
            if (j < nodeGraph.dimensions.columns - 1) {
                const rightNodeIndex = i * nodeGraph.dimensions.columns + (j + 1);
                node.addLink(nodeGraph.nodes[rightNodeIndex], 1);
            }
            if (node.state === "wall") {
                node.links = [];
            }
        }
    }
}


function dijkstra(nodeGraph) {
    const start = nodeGraph.start;
    const end = nodeGraph.end;
    for (const node of nodeGraph.nodes) {
        if (node === start) {
            node.value = 0;
        } else {
            node.value = Infinity;
        }
        node.previousNode = null;
    }

    const unvisitedNodes = nodeGraph.nodes.slice();

    while (unvisitedNodes.length > 0) {
        const currentNode = unvisitedNodes.reduce((minNode, node) => (node.value < minNode.value ? node : minNode), unvisitedNodes[0]);
        if (currentNode === end) break; // Break if we reached the end node

        for (const { target, value } of currentNode.links) {
            const distance = currentNode.value + value;
            if (distance < target.value) {
                target.value = distance;
                target.previousNode = currentNode;
            }
        }

        unvisitedNodes.splice(unvisitedNodes.indexOf(currentNode), 1);
    }

    const path = [];
    let currentNode = end;
    while (currentNode) {
        path.unshift(currentNode.id);
        currentNode = currentNode.previousNode;
    }
    return path;
}

async function runDijkstraOnNodegraph(boxGraph) {
    const nodeGraph = initializeNodeGraphFromBoxGraph(boxGraph);
    initializeNodeGraphLinks(nodeGraph);
    nodeGraph.validate();
    const path = dijkstra(nodeGraph);
    const filteredPath = path.slice(1, -1);
    return filteredPath
}


function getRowColFromID(nodeGraph, id) {
    const row = Math.floor(id / nodeGraph.dimensions.columns);
    const col = id % nodeGraph.dimensions.columns;
    return { row, col };
}

function euclideanDistance(nodeGraph, start, end) {
    const node1Pos = getRowColFromID(nodeGraph, start.id);
    const node2Pos = getRowColFromID(nodeGraph, end.id);
    const rowDiff = node1Pos.row - node2Pos.row;
    const colDiff = node1Pos.col - node2Pos.col;
    const distance = Math.sqrt(rowDiff * rowDiff + colDiff * colDiff);
    return distance;
}

function aStar(nodeGraph) {
    const start = nodeGraph.start;
    const end = nodeGraph.end;

    const openList = [start];
    const closedSet = new Set();

    start.cost = 0;
    start.estimate = euclideanDistance(nodeGraph, start, end);

    while (openList.length > 0) {
        openList.sort((a, b) => {
            return (a.cost + a.estimate) - (b.cost + b.estimate);
        });

        const currentNode = openList.shift();

        if (currentNode === end) {
            const path = [];
            let backtrackingNode = currentNode;
            while (backtrackingNode) {
                path.unshift(backtrackingNode.id);
                backtrackingNode = backtrackingNode.previousNode;
            }
            return path;
        }

        closedSet.add(currentNode);

        const neighbors = currentNode.links.map(link => link.target);

        for (const neighbor of neighbors) {
            if (closedSet.has(neighbor)) {
                continue;
            }

            const tentativeCost = currentNode.cost + 1;

            if (!openList.includes(neighbor) || tentativeCost < neighbor.cost) {
                neighbor.previousNode = currentNode;
                neighbor.cost = tentativeCost;
                neighbor.estimate = euclideanDistance(nodeGraph, neighbor, end);

                if (!openList.includes(neighbor)) {
                    openList.push(neighbor);
                }
            }
        }
    }

    // No path found
    return null;
}

async function runAStarOnNodegraph(boxGraph) {
    const nodeGraph = initializeNodeGraphFromBoxGraph(boxGraph);
    initializeNodeGraphLinks(nodeGraph);
    nodeGraph.validate();
    const path = aStar(nodeGraph);
    const filteredPath = path.slice(1, -1);
    return filteredPath
}

export { runDijkstraOnNodegraph, runAStarOnNodegraph };