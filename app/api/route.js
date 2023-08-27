import * as NodeGraphHandler from './NodeGraphHandler';

export async function POST(req, res) {
  try {
    const body = await req.json();
    const instruction = req.headers.get("Instruction");

    switch (instruction) {
      case "runDijkstra":
        const djikstraData = await NodeGraphHandler.runDijkstraOnNodegraph(body.boxGraph);
        const djikstraResponse = new Response(JSON.stringify(djikstraData), {
          headers: { "Content-Type": "application/json" },
        });
        return djikstraResponse;
      case "runAStar":
        const aStarData = await NodeGraphHandler.runAStarOnNodegraph(body.boxGraph);
        const aStarResponse = new Response(JSON.stringify(aStarData), {
          headers: { "Content-Type": "application/json" },
        });
        return aStarResponse;
      default:
        return new Response({error: "Invalid instruction", status: 400 });
    }
  } catch (error) {
    console.error("Error in POST request: ", error);
    return new Response({ error: error.message, status: 500 });
  }
} 