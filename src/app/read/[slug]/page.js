'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ReadPage({ params }) {
  const chapterId = params.slug;
  const router = useRouter();

  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chapterInfo, setChapterInfo] = useState(null);
  const [nextChapterId, setNextChapterId] = useState(null);
  const [prevChapterId, setPrevChapterId] = useState(null);
  const [mangaId, setMangaId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!chapterId) return;

    async function fetchChapter() {
      try {
        setLoading(true);
        setError(null);

        // Fetch image data
        const res = await fetch(`/api/read?chapterId=${chapterId}`);
        const data = await res.json();
        const baseUrl = data.baseUrl;
        const hash = data.chapter.hash;
        const imageFiles = data.chapter.data;

        const fullPageUrls = imageFiles.map(file => `${baseUrl}/data/${hash}/${file}`);
        setPages(fullPageUrls);

        // Chapter metadata
        const metaRes = await fetch(`/api/meta?chapterId=${chapterId}`);
        const metaData = await metaRes.json();
        setChapterInfo(metaData.data?.attributes || null);

        const mangaRelationship = metaData.data.relationships.find(r => r.type === 'manga');
        const mid = mangaRelationship?.id;
        setMangaId(mid);

        // Get all chapters of manga
        const chapterListRes = await fetch(`/api/panels?mangaId=${mid}`);
        const chapterListData = await chapterListRes.json();

        const chapterList = chapterListData.data;
        const currentChapterIndex = chapterList.findIndex(chap => chap.id === chapterId);

        if (currentChapterIndex > 0) {
          setPrevChapterId(chapterList[currentChapterIndex - 1].id);
        }
        if (currentChapterIndex < chapterList.length - 1) {
          setNextChapterId(chapterList[currentChapterIndex + 1].id);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load chapter.');
      } finally {
        setLoading(false);
      }
    }

    fetchChapter();
  }, [chapterId]);

  const navigateTo = (id) => router.push(`/read/${id}`);
  const navigateToMangaProfile = () => mangaId && router.push(`/manga/${mangaId}`);

  return (
    <div className="bg-gray-100 dark:bg-[#111] min-h-screen p-6 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {loading ? (
        <div className="text-center text-lg mt-10">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <>
          {chapterInfo && (
            <div className="text-center mb-6">
              <h1 className="text-2xl font-semibold">Chapter {chapterInfo.chapter || '—'}</h1>
              <p className="text-gray-400 text-sm">{chapterInfo.title || 'Untitled'}</p>
            </div>
          )}

<div className="flex justify-center gap-4 mb-6">
  {prevChapterId && (
    <button
      onClick={() => navigateTo(prevChapterId)}
      className="bg-gray-200 text-black dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-2 rounded transition"
    >
      ← Previous
    </button>
  )}
  {mangaId && (
    <button
      onClick={navigateToMangaProfile}
      className="bg-gray-300 text-black dark:bg-gray-800 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-700 px-4 py-2 rounded transition"
    >
      🏠 Manga
    </button>
  )}
  {nextChapterId && (
    <button
      onClick={() => navigateTo(nextChapterId)}
      className="bg-gray-200 text-black dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-2 rounded transition"
    >
      Next →
    </button>
  )}
</div>


          <div className="flex flex-col items-center gap-4">
            {pages.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Page ${index + 1}`}
                className="w-full max-w-screen-md shadow-md rounded"
                loading="lazy"
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
