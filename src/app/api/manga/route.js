// pages/api/manga.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Get the manga ID from the query string (assuming you send the id as a query parameter)
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    // Validate the id
    if (!id) {
      return NextResponse.json({ error: 'Manga ID is required' }, { status: 400 });
    }

    // Construct the URL for the MangaDex API request
    const mangaUrl = `https://api.mangadex.org/manga/${id}?includes[]=author&includes[]=artist&includes[]=cover_art`;
    
    // Fetch data from the MangaDex API
    const res = await fetch(mangaUrl, {
      headers: {
        'User-Agent': 'comickun/1.0',
            },
    });

    // If the response is successful, parse and return the data
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch data from MangaDex' }, { status: 500 });
    }

    const mangaData = await res.json();
    return NextResponse.json(mangaData);

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
