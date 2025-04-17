'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import SearchCanvas from './search-canvas';
export default function Navbar() {
  const [isClient, setIsClient] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearch = async (query) => {
    try {
      const res = await fetch(`/api/search?q=${query}`);
      const data = await res.json();
      setSearchResults(data);
      setIsSearchOpen(true);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const closeSearchPanel = () => {
    setIsSearchOpen(false);
  };
  useEffect(() => {
    setIsClient(true); // ensure this runs only on the client
    const isDark = localStorage.getItem('theme') === 'dark';
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newMode);
  };

  if (!isClient) return null; // skip SSR rendering to avoid mismatch

  return (
    <nav className="bg-white dark:bg-zinc-900 text-black dark:text-white px-4 py-3 flex justify-between items-center shadow-md">
      <Link href={'/'} className="text-xl font-bold cursor-pointer">ComicKun</Link>


      <div className='flex gap-2 items-center'>

        <SearchCanvas />

        <button
          onClick={toggleDarkMode}
          className="bg-zinc-200 dark:bg-zinc-800 p-2 rounded"
        >
          {darkMode ?

            <span className=''>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-moon-fill" viewBox="0 0 16 16">
                <path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278" />
              </svg>
            </span>

            :



            <span className='text-yellow-500'>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-brightness-low-fill" viewBox="0 0 16 16">
                <path d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0M8.5 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m0 11a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m5-5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m-11 0a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m9.743-4.036a.5.5 0 1 1-.707-.707.5.5 0 0 1 .707.707m-7.779 7.779a.5.5 0 1 1-.707-.707.5.5 0 0 1 .707.707m7.072 0a.5.5 0 1 1 .707-.707.5.5 0 0 1-.707.707M3.757 4.464a.5.5 0 1 1 .707-.707.5.5 0 0 1-.707.707" />
              </svg>
            </span>
          }
        </button>
      </div>



    </nav>
  );
}
