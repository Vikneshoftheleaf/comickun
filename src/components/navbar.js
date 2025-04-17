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


      <SearchCanvas />

      <button
        onClick={toggleDarkMode}
        className="bg-zinc-800 text-white dark:bg-zinc-200 dark:text-black px-3 py-1 rounded"
      >
        {darkMode ? '🌞 Light' : '🌙 Dark'}
      </button>

      
    </nav>
  );
}
