import * as GraphHandler from './GraphHandler'
import { NextResponse } from 'next/server';

const rows = Math.floor(700 / 25);
const columns = Math.floor(1200 / 25);

export async function GET(request, response) {
    const graph = GraphHandler.InitializeBlankGraph(rows, columns);
    return NextResponse.json(graph); // Will be automatically JSON serialized
}

export async function POST(request, response) {
    const array = await request.json();
    const path = GraphHandler.RunDijkstra(array, rows, columns);
    return NextResponse.json(path); // Will be automatically JSON serialized
}