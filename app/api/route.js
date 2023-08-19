import { NextResponse } from 'next/server';
import * as NodeGraphHandler from './NodeGraphHandler';
import * as BoxGraphHandler from './BoxGraphHandler';

export async function POST(req, res) {
  try {
    const body = await req.json();
    const instruction = req.headers.get("Instruction");

    switch (instruction) {
      case "initializeGraphs":
        const data = await BoxGraphHandler.initializeBoxGraph(body.dimensions);
        const response = new Response(JSON.stringify(data), {
          headers: { "Content-Type": "application/json" },
        });
        return response;
      default:
        return new Response({error: "Invalid instruction", status: 400 });
    }
  } catch (error) {
    console.error("Error in POST request: ", error);
    return new Response({ error: error.message, status: 500 });
  }
} 