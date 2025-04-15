// app/api/chapter-list/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const mangaId = searchParams.get('mangaId');

    if (!mangaId) {
      return NextResponse.json({ error: 'mangaId is required' }, { status: 400 });
    }

    const chapterListRes = await fetch(`https://api.mangadex.org/manga/${mangaId}/feed?limit=500&translatedLanguage[]=en&order[chapter]=asc`, {
      headers: {
        'User-Agent': 'comickun/1.0',
            },
    });

    if (!chapterListRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch chapter list' }, { status: 500 });
    }

    const data = await chapterListRes.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('Error fetching chapter list:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
