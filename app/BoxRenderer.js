'use client'
import React, { useState, useContext } from "react";
import styles from "./page.module.css";
import Box from "./Box";
import { GraphContext, MatchGrapToArrayState } from "./GraphHandler";

export async function GET() {
  const res = await fetch('localhost:3000/api/graph')
  const data = await res.json()
 
  return NextResponse.json(data)
}

function ParentComponent() {
  const { path } = useContext(GraphContext);

  const rows = Math.floor(700 / 25);
  const columns = Math.floor(1200 / 25);

  const initialBoxArray = Array.from({ length: rows * columns }, (_, index) => ({
    id: (rows - 1 - Math.floor(index / columns)) * columns + (index % columns),
    state: "path" // Initialize each box as "path"
  }));

  const [boxArray, setBoxArray] = useState(initialBoxArray);

  const setBoxState = (boxId, newState) => {
    const updatedBoxArray = boxArray.map((box) =>
      box.id === boxId ? { ...box, state: newState } : box
    );
    setBoxArray(updatedBoxArray);
  };

  const handleFunction = () => {
    GET();
  };

  return (
    <div>
      <div className={styles.boxhandler}>
        {boxArray.map((box) => (
          <Box
            key={box.id}
            id={box.id}
            state={box.state}
            setBoxState={setBoxState}
          />
        ))}
      </div>
      <button onClick={handleFunction}>Perform Function</button>
    </div>
  );
}

export default ParentComponent;
