// pages/api/manga.js
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const response = await fetch('https://api.mangadex.org/manga?limit=10&order[followedCount]=desc&includes[]=cover_art', {
      headers: {
        'User-Agent': 'comickun/1.0',  // Set a custom User-Agent (optional)
      },
    });

    // Check if the response is OK (status code 200)
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch manga data' }, { status: response.status });
    }

    // Read the response text to handle possible issues with non-JSON responses
    const text = await response.text();
    // Check if the response is empty
    if (!text) {
      return NextResponse.json({ error: 'Empty response from MangaDex API' }, { status: 500 });
    }

    // Try to parse the response as JSON
    const data = JSON.parse(text);

    // Send the data back as the response
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching manga data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
