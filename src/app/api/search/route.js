import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') ?? '';

  if (!title.trim()) {
    return NextResponse.json({ data: [] });
  }

  try {
    const res = await fetch(
      `https://api.mangadex.org/manga?title=${title}&limit=10&includes[]=cover_art`,
      {
        headers: {
          'User-Agent': 'comickun/1.0',
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json({ data: [] });
    }

    const data = await res.json();

    const results = await Promise.all(
      data.data.map(async (manga) => {
        const cover = manga.relationships.find((r) => r.type === 'cover_art');
        const fileName = cover?.attributes?.fileName;

        let imageBase64 = null;

        if (fileName) {
          const imageUrl = `https://uploads.mangadex.org/covers/${manga.id}/${fileName}.256.jpg`;

          try {
            const response = await fetch(imageUrl, {
              headers: {
                'User-Agent': 'comickun/1.0',
              },
            });

            if (response.ok) {
              const contentType = response.headers.get('content-type') || 'image/jpeg';
              const buffer = await response.arrayBuffer();
              imageBase64 = `data:${contentType};base64,${Buffer.from(buffer).toString('base64')}`;
            }
          } catch (err) {
            console.error(`Failed to fetch image for manga: ${manga.id}`, err);
          }
        }

        return {
          id: manga.id,
          title: manga.attributes.title.en || 'No Title',
          imageUrl: imageBase64,
        };
      })
    );

    return NextResponse.json({ data: results });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ data: [] });
  }
}
