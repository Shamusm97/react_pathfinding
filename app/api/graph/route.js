import * as GraphHandler from './GraphHandler'
import { NextResponse } from 'next/server';

export async function POST(request, response) {
    try {
        const instruction = request.headers.get('Instruction');
        const requestBody = await request.json(); // Parse the request body as JSON

        if (instruction === 'InitializeBlankGraph') {
            if (!requestBody || !requestBody.dimension) {
                return new Response('Invalid request body', { status: 400 });
            }

            const { rows, columns } = requestBody.dimension;
            const graph = GraphHandler.InitializeBlankGraph(rows, columns);

            return NextResponse.json(graph, {
                headers: { 'Content-Type': 'application/json' },
            });
        } else if (instruction === 'RunDijkstra') {
            if (!requestBody || !requestBody.boxArray) {
                console.log(requestBody);
                return new Response('Invalid request body', { status: 400 });
            }

            const boxArray = requestBody.boxArray;

            const path = GraphHandler.RunDijkstra(boxArray);
            return NextResponse.json(path, {
                headers: { 'Content-Type': 'application/json' },
            });
        } else if (instruction === 'RunAStar') {
            if (!requestBody || !requestBody.boxArray) {
                return new Response('Invalid request body', { status: 400 });
            }

            const boxArray = requestBody.boxArray;

            try {
                const path = await GraphHandler.RunAStar(boxArray);

                return new Response(JSON.stringify(path), {
                    headers: { 'Content-Type': 'application/json' },
                });
            } catch (error) {
                // Handle the error appropriately
                console.error('An error occurred:', error);
                return new Response('Error occurred', { status: 500 });
            }
        }
    } catch (error) {
        console.error('Error handling request:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}