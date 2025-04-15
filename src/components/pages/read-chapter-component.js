export default async function ReadChapterComponent({pages, chapterInfo}) {
    return (
        <div className="bg-gray-100 dark:bg-[#111] min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300">
           
                    {/**chapterInfo && (
                        <div className="text-center mb-6">
                            <h1 className="text-2xl font-semibold">Chapter {chapterInfo.chapter || '—'}</h1>
                            <p className="text-gray-400 text-sm">{chapterInfo.title || 'Untitled'}</p>
                        </div>
                    )**/}

                    {/**<div className="flex justify-center gap-4 mb-6">
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
                        </div>**/}


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
             
        </div>
    )
}