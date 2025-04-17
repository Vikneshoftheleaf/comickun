// app/api/search/route.ts
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') ?? '';

  if (!title.trim()) {
    return NextResponse.json({ data: [] });
  }

  try {
    const res = await fetch(
      `https://api.mangadex.org/manga?title=${title}&limit=10&includes[]=cover_art`
    );

    if (!res.ok) {
      return NextResponse.json({ data: [] });
    }

    const data = await res.json();

    const results = data.data.map((manga) => {
      const cover = manga.relationships.find((r) => r.type === 'cover_art');
      const fileName = cover?.attributes?.fileName;
      const imageUrl = fileName
        ? `https://uploads.mangadex.org/covers/${manga.id}/${fileName}.256.jpg`
        : null;

      return {
        id: manga.id,
        title: manga.attributes.title.en || 'No Title',
        imageUrl,
      };
    });

    return NextResponse.json({ data: results });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ data: [] });
  }
}
