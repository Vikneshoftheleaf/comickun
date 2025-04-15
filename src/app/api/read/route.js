// app/api/reader/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const chapterId = searchParams.get('chapterId');

    if (!chapterId) {
      return NextResponse.json({ error: 'chapterId is required' }, { status: 400 });
    }

    const res = await fetch(`https://api.mangadex.org/at-home/server/${chapterId}`, {
      headers: {
        'User-Agent': 'comickun/1.0',
            },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch reader data' }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
