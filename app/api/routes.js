import * as NodeGraphHandler from './nodeGraph/NodeGraphHandler';
import * as BoxGraphHandler from './boxGraph/BoxGraphHandler';

export default function handler(req, res) {
    return res.status(200).json({ name: 'John Doe' })
    if (req.method === 'POST') {

        const body = req;
        const Instruction = req.headers;

        if (Instruction === "initializeGraphs") {
            const dimensions = body;
            console.log(dimensions);
        }
    } else {
      // Handle any other HTTP method
    }
  }