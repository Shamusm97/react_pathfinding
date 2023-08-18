let rows = 0;
let columns = 0;

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

export function InitializeBlankGraph(calculatedRows, calculatedColumns) {
    rows = calculatedRows;
    columns = calculatedColumns;
    const nodeGraph = [];
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            const node = new Node(i * columns + j, null);
            nodeGraph.push(node);
        }
    }

    return nodeGraph;
}

export function InitializeGraphFromBoxArray(boxArray) {
    const nodeGraph = [];
    for (let i = 0; i < boxArray.length; i++) {
        const node = new Node(boxArray[i].id, null);
        node.state = boxArray[i].state;
        nodeGraph.push(node);
    }
    return nodeGraph;
}

export function InitializeGraphLinkWeights(nodeGraph, rows, columns) {
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
            if (node.state === "wall") {
                node.links = [];
            }
        }
    }
}

export function Dijkstra(nodeGraph, start, end) {
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

export function RunDijkstra(boxArray) {
    const nodeGraph = InitializeGraphFromBoxArray(boxArray);
    InitializeGraphLinkWeights(nodeGraph, rows, columns);
    const start = nodeGraph.find(node => node.state === "start");
    const end = nodeGraph.find(node => node.state === "end");
    const path = Dijkstra(nodeGraph, start, end);
    return path
}

function getRowColFromID(id) {
    const row = Math.floor(id / columns);
    const col = id % columns;
    return { row, col };
}

export function euclideanDistance(start, end) {
    const node1Pos = getRowColFromID(start.id);
    const node2Pos = getRowColFromID(end.id);
    const rowDiff = node1Pos.row - node2Pos.row;
    const colDiff = node1Pos.col - node2Pos.col;
    const distance = Math.sqrt(rowDiff * rowDiff + colDiff * colDiff);
    return distance;
}

export function performAStar(nodeGraph, start, end) {
    // Create an empty data structure to store the explored paths
    let explored = [];

    // Create a data structure to store the nodes that are being explored
    let frontier = [{
        node: start,
        cost: 0,
        estimate: euclideanDistance(start, end)
    }];

    // While there are nodes being explored
    while (frontier.length > 0) {
        // Sort the nodes in the frontier by cost, with the lowest-cost nodes first
        frontier.sort((a, b) => {
            return a.estimate - b.estimate;
        });

        // Choose the lowest-cost node from the frontier
        let currentNodeData = frontier.shift();

        // Add this node to the explored paths
        explored.push(currentNodeData);
        // If this node reaches the goal, return the path
        if (currentNodeData.node === end) {
            const path = [];
            let currentNode = currentNodeData;
            while (currentNode) {
                path.unshift(currentNode.node.id);
                currentNode = currentNode.node.previousNode;
            }
            return path;
        }

        // Generate the possible next steps from this node's links
        let next = currentNodeData.node.links;

        // For each possible next step
        for (let i = 0; i < next.length; i++) {
            // Calculate the cost of the next step by adding the step's cost to the node's cost
            let step = next[i];
            let cost = step.value + currentNodeData.cost;

            // Check if this step has already been explored
            let isExplored = explored.some(e => e.node === step.target);

            // Avoid repeated nodes during the calculation of neighbors
            let isFrontier = frontier.some(e => e.node === step.target);

            // If this step has not been explored
            if (!isExplored && !isFrontier) {
                // Set the previousNode property for the next step node
                step.target.previousNode = currentNodeData.node; // Set the previousNode to the current node

                // Add the step.target node to the frontier, using the cost and the heuristic function to estimate the total cost to reach the goal
                frontier.push({
                    node: step.target,
                    cost: cost,
                    estimate: cost + euclideanDistance(step.target, end)
                });
            }
        }
    }

    // If there are no paths left to explore, return null to indicate that the goal cannot be reached
    return null;
}

function astar(nodeGraph, start, end) {
    const openList = [start];
    const closedSet = new Set();

    start.cost = 0;
    start.estimate = euclideanDistance(start, end);

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
                neighbor.estimate = euclideanDistance(neighbor, end);

                if (!openList.includes(neighbor)) {
                    openList.push(neighbor);
                }
            }
        }
    }

    // No path found
    return null;
}

export async function RunAStar(boxArray) {
    const nodeGraph = InitializeGraphFromBoxArray(boxArray);
    InitializeGraphLinkWeights(nodeGraph, rows, columns);
    const start = nodeGraph.find(node => node.state === "start");
    const end = nodeGraph.find(node => node.state === "end");
    const path = astar(nodeGraph, start, end);
    return path
}