
import Image from 'next/image';

export default function SearchResults({ results, onClose }) {
  return (
    <div className="absolute top-0 left-0 w-full h-screen bg-black bg-opacity-60 flex justify-center items-center">
      <div className="bg-gray-800 p-4 rounded-lg max-w-lg w-full h-full overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-xl"
        >
          &times;
        </button>
        <h2 className="text-white text-2xl mb-4">Search Results</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {results.map((manga) => (
            <div key={manga.id} className="bg-gray-700 rounded-lg overflow-hidden">
              {manga.coverImage ? (
                <Image
                src={`/api/popular-images?url=${encodeURIComponent(`https://uploads.mangadex.org/covers/${manga.id}/${manga.coverImage}.512.jpg`)}`}
                  
                  alt={manga.title}
                  width={200}
                  height={300}
                  className="w-full h-auto object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-500" />
              )}
              <div className="p-2">
                <h3 className="text-white text-lg">{manga.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
