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
    for( let i=0; i < rows; i++ ) {
        for( let j=0; j < columns; j++ ) {
            const node = new Node( i * columns + j, null );
            nodeGraph.push(node);
        }
}

return nodeGraph;
}

export function InitializeGraphFromBoxArray(boxArray) {
    const nodeGraph = [];
    for( let i=0; i < boxArray.length; i++ ) {
        const node = new Node( boxArray[i].id, null );
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
  
export function Dijkstra(nodeGraph, start, end){
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
    console.log(boxArray);
    const nodeGraph = InitializeGraphFromBoxArray(boxArray);
    InitializeGraphLinkWeights(nodeGraph, rows, columns);
    const start = nodeGraph.find(node => node.state === "start");
    const end = nodeGraph.find(node => node.state === "end");
    const path = Dijkstra(nodeGraph, start, end);
    return path
}