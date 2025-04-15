// For App Router (app/api/chapters/route.js)
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Manga ID is required' }, { status: 400 });
    }

    const chapterUrl = `https://api.mangadex.org/chapter?manga=${id}&translatedLanguage[]=en&order[chapter]=asc&limit=100`;

    const res = await fetch(chapterUrl, {
      headers: {
        'User-Agent': 'comickun/1.0', // Required by MangaDex
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch chapters' }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
