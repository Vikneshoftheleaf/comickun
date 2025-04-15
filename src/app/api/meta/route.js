// app/api/chapter-meta/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const chapterId = searchParams.get('chapterId');

    if (!chapterId) {
      return NextResponse.json({ error: 'chapterId is required' }, { status: 400 });
    }

    const metaRes = await fetch(`https://api.mangadex.org/chapter/${chapterId}`, {
      headers: {
        'User-Agent': 'comickun/1.0',
      },
    });

    if (!metaRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch chapter metadata' }, { status: metaRes.status });
    }

    const data = await metaRes.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('Error fetching chapter metadata:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
