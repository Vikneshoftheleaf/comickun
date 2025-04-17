'use client';
import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
export default function BottomDrawerSearch() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    useEffect(() => {
        setOpen(false)
    }, [pathname, searchParams])

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const controller = new AbortController();

        const fetchData = async () => {
            try {
                const res = await fetch(`/api/search?title=${encodeURIComponent(query)}`, {
                    signal: controller.signal,
                });
                const json = await res.json();
                setResults(json.data);
            } catch (err) {
                if (err.name !== 'AbortError') console.error(err);
            }
        };

        const delay = setTimeout(fetchData, 300); // debounce
        return () => {
            controller.abort();
            clearTimeout(delay);
        };
    }, [query]);

    return (
        <>
            {/* Floating Button 
            <button
                className="rounded bg-gray-100 text-gray-800  w-12 h-12 flex items-center justify-center border"
                onClick={() => setOpen(true)}
                aria-label="Search"
            >
                🔍
            </button>
            */}

            <div
                onClick={() => setOpen(true)}
                className="bg-zinc-200 dark:bg-zinc-800 text-gray-500 cursor-pointer p-2 md:p-0  rounded md:rounded-none flex items-center gap-2"
            >
                {/* Icon for all screens */}
                <span className="text-xl dark:text-zinc-100 block lg:hidden ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                    </svg>
                </span>

                {/* Input only visible on md+ screens */}
                <input
                    type="text"
                    placeholder="Search comics..."
                    className="hidden md:block dark:bg-zinc-800 bg-gray-200 text-gray-800 p-2 rounded-md  w-64 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    readOnly
                />
            </div>

            {/* Drawer */}
            <div
                className={`fixed inset-0 z-40 transition-all ${open ? 'translate-y-0' : 'translate-y-full'
                    }`}
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                onClick={() => setOpen(false)}
            >
                <div className="transition-colors duration-300 dark:bg-[#111] absolute min-h-[90vh] bottom-0 pb-8 left-0 right-0 bg-gray-100 text-gray-800 rounded-t-2xl px-4  overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    {/* Search Input */}

                    <div className='sticky dark:bg-[#111] top-0 flex items-center gap-2 h-full py-6 w-full bg-gray-100 border-gray-300  '>



                        <span className='bg-gray-200 dark:bg-zinc-800 dark:text-gray-100 p-2 rounded text-gray-500'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                            </svg>
                        </span>

                        <input
                            type="text"
                            placeholder="Search comics..."
                            className="dark:bg-zinc-800 dark:text-gray-100 w-full p-2 rounded bg-gray-200 text-gray-800 focus:outline-none "
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />

                        <button className='rounded p-2 bg-gray-200 dark:bg-zinc-800 dark:text-gray-100 text-gray-500' onClick={() => setOpen(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                            </svg>
                        </button>

                    </div>

                    {/* Results */}
                    <div className="mt-2 grid grid-cols-1 lg:grid-cols-3 gap-2">
                        {results.map((item) => (
                            <Link
                                href={`/manga-page/${item.id}`}
                                key={item.id}
                                className="dark:bg-zinc-800 dark:text-gray-100 flex items-center bg-gray-200 rounded p-2 gap-4 hover:bg-gray-300 transition"
                            >
                                {item.imageUrl && (
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title}
                                        className="w-14 h-20 object-cover rounded"
                                    />
                                )}
                                <span className="text-sm font-medium">{item.title}</span>
                            </Link>
                        ))}
                        {query && results.length === 0 && (
                            <p className="text-gray-800 text-sm">No results found.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
