import Link from "next/link";
export default function MangaPageComponent({manga, chapters})
{
  const chapterArray = Array.isArray(chapters.data) ? chapters.data : [];
  const seenChapters = new Set();

    return(
        <div className="bg-gray-100 dark:bg-[#111] min-h-screen p-6 text-gray-900 dark:text-gray-100 transition-colors duration-300">
       
        
            <div className="flex flex-col md:flex-row gap-6 mb-10">
              {manga.coverImage && (
                <img src={manga.coverImage} alt={manga.title} className="w-64 rounded-xl shadow-lg" />
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
                {chapterArray
                  .filter((chap) => {
                    const chapNum = chap.attributes.chapter;
                    if (!chapNum || seenChapters.has(chapNum)) return false;
                    seenChapters.add(chapNum);
                    return true;
                  })
                  .sort((a, b) => parseFloat(b.attributes.chapter) - parseFloat(a.attributes.chapter))
                  .map((chap) => (
                    <Link
                      key={chap.id}
                      href={`/read-chapter/${chap.id}`}
                      className="bg-white dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors rounded-lg p-3 shadow text-center font-medium"
                    >
                      Chapter {chap.attributes.chapter}
                    </Link>
                  ))}
              </div>
            </div>
         
      </div>
    )
}