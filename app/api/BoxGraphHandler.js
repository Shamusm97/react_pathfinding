class Box {
  constructor(id, state) {
    this.id = id;
    this.state = state;
  }
}

class BoxArray {
  constructor(dimensions) {
    this.dimensions = dimensions;
    this.boxArray = this.generateBlankBoxArray();
  }

  generateBlankBoxArray = () => {
    const boxArray = [];
    for (let i = 0; i < this.dimensions.rows; i++) {
      for (let j = 0; j < this.dimensions.columns; j++) {
        boxArray.push({
          id: i * this.dimensions.columns + j,
          state: "open"
        });
      }
    }
    return boxArray;
  };

  getBoxArray = () => {
    return this.boxArray;
  };

  setBoxState = (index, state) => {
    this.boxArray[index].state = state;
  };

  getBoxState = (index) => {
    return this.boxArray[index].state;
  };
}