import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');

  if (!query || query.trim() === '') {
    return NextResponse.json([], { status: 400 });
  }

  try {
    const searchRes = await fetch(`https://api.mangadex.org/manga?title=${query}&limit=10&includes[]=cover_art`);
    const searchData = await searchRes.json();

    const results = searchData.data.map((manga) => ({
      id: manga.id,
      title: manga.attributes.title.en || manga.attributes.title[Object.keys(manga.attributes.title)[0]],
      coverImage: manga.relationships.find(rel => rel.type === 'cover_art')?.attributes?.file_name
    }));

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('Error fetching search results:', error);
    return NextResponse.json([], { status: 500 });
  }
}
