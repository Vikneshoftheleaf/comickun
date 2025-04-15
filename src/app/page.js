'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [mangaList, setMangaList] = useState([]);

  useEffect(() => {
    async function fetchManga() {
      const res = await fetch('https://api.mangadex.org/manga?limit=10&order[followedCount]=desc&includes[]=cover_art');
      const data = await res.json();

      const mangaWithCovers = data.data.map((manga) => {
        const coverArt = manga.relationships.find(rel => rel.type === 'cover_art');
        const coverFileName = coverArt?.attributes?.fileName;
        const coverUrl = coverFileName
          ? `https://uploads.mangadex.org/covers/${manga.id}/${coverFileName}.256.jpg`
          : null;

        return {
          id: manga.id,
          title: manga.attributes.title.en || 'No Title',
          coverUrl,
        };
      });

      setMangaList(mangaWithCovers);
    }

    fetchManga();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-[#111] p-6 transition-colors duration-300">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 dark:text-white">
        📚 Popular Manga
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {mangaList.map(manga => (
          <div
            key={manga.id}
            className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            <Link href={`/manga/${manga.id}`}>
              {manga.coverUrl ? (
                <img
                  src={manga.coverUrl}
                  alt={manga.title}
                  className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-64 bg-gray-300 dark:bg-zinc-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
                  No Cover
                </div>
              )}
            </Link>
            <div className="p-3 text-sm font-medium text-center text-gray-800 dark:text-gray-200">
              {manga.title}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
