'use client'

import { useEffect, useState } from 'react';

export default function MangaProfile({ params }) {
  const id = params.slug;

  const [manga, setManga] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [coverUrl, setCoverUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const seenChapters = new Set();

  useEffect(() => {
    if (!id) return;

    async function fetchMangaDetails() {
      setLoading(true);

      const mangaRes = await fetch(`/api/manga?id=${id}`);
      const mangaData = await mangaRes.json();
      const mangaInfo = mangaData.data;

      const coverRel = mangaInfo.relationships.find(r => r.type === 'cover_art');
      const coverFileName = coverRel?.attributes?.fileName;
      const coverImg = coverFileName
        ? `https://uploads.mangadex.org/covers/${id}/${coverFileName}.512.jpg`
        : null;

      setCoverUrl(coverImg);
      setManga({
        title: mangaInfo.attributes.title.en || 'No Title',
        description: mangaInfo.attributes.description.en || 'No description',
        status: mangaInfo.attributes.status,
        tags: mangaInfo.attributes.tags.map(tag => tag.attributes.name.en),
        author: mangaInfo.relationships.find(r => r.type === 'author')?.attributes?.name || 'Unknown',
      });

      const chapterRes = await fetch(`/api/chapters?id=${id}`);
      const chapterData = await chapterRes.json();
      setChapters(chapterData.data);

      setLoading(false);
    }

    fetchMangaDetails();
  }, [id]);

  return (
    <div className="bg-gray-100 dark:bg-[#111] min-h-screen p-6 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {loading ? (
        <p className="text-center text-xl text-gray-700 dark:text-gray-300">Loading...</p>
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-6 mb-10">
            {coverUrl && (
              <img src={coverUrl} alt={manga.title} className="w-64 rounded-xl shadow-lg" />
            )}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-4">{manga.title}</h1>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                {manga.description}
              </p>
              <p className="mb-1"><span className="font-semibold">📌 Status:</span> {manga.status}</p>
              <p className="mb-2"><span className="font-semibold">✍️ Author:</span> {manga.author}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {manga.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-gray-300 dark:bg-zinc-700 text-xs px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
              📖 Chapters
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {chapters
                .filter((chap) => {
                  const chapNum = chap.attributes.chapter;
                  if (!chapNum || seenChapters.has(chapNum)) return false;
                  seenChapters.add(chapNum);
                  return true;
                })
                .sort((a, b) => parseFloat(b.attributes.chapter) - parseFloat(a.attributes.chapter))
                .map((chap) => (
                  <a
                    key={chap.id}
                    href={`/read/${chap.id}`}
                    className="bg-white dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors rounded-lg p-3 shadow text-center font-medium"
                  >
                    Chapter {chap.attributes.chapter}
                  </a>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
