# React Pathfinding Visualizer

## Description
This is a pathfinding visualizer built with React. It allows the user to select a start and end node, and optionally select walls to block the path. The user can then select a pathfinding algorithm and watch the algorithm find the shortest path between the start and end nodes.

## How to Use

### Selecting Nodes
Nodes rotate between four states: path (the default state), wall, start and end. Clicking on a node causes it to rotate through the available states. Only one start and end node can exist at any one time.

### Selecting an Algorithm
At the moment the only available algorithms are:
- Dijkstra's Algorithm
- A* Algorithm

More algorithms will be added in the future.

### Executing the Algorithm
Press the corresponding pathfinding button to execute the algorithm. The algorithm will then find the shortest path between the start and end nodes. The algorithm will not execute if there is no start or end node, or if there is no path between the start and end nodes.

### Clearing the Board
Press the Reset button to completely reset the board. This will remove all walls and the start and end nodes.

### Generating random walls
Press the Generate Walls button to generate a random set of walls. This will remove all walls and the start and end nodes. The slider can be used to adjust the density of the walls.

## How to Run
### Live Version
1. Clone the repository
2. Run `npm install` to install the dependencies
3. Run `npm start` to start the application
4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Deployed Version
The application is deployed on Vercel and can be accessed [here](https://react-pathfinding-two.vercel.app/).