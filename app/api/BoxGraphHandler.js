class Box {
  constructor(id, state) {
    this.id = id;
    this.state = state;
  }
}

class BoxGraph {
  constructor(dimensions) {
    this.dimensions = dimensions;
    this.boxGraph = this.generateBlankBoxGraph();
  }

  generateBlankBoxGraph = () => {
    const boxGraph = [];
    for (let i = 0; i < this.dimensions.rows; i++) {
      for (let j = 0; j < this.dimensions.columns; j++) {
        boxGraph.push({
          id: i * this.dimensions.columns + j,
          state: "open"
        });
      }
    }
    return boxGraph;
  };

  setBoxState = (index, state) => {
    this.boxGraph[index].state = state;
  };

  getBoxState = (index) => {
    return this.boxGraph[index].state;
  };
}

async function initializeBoxGraph(dimensions) {
  return new BoxGraph(dimensions);
}

export { initializeBoxGraph };