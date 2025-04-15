'use client'
import { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div className="relative flex gap-2  w-full max-w-lg mx-auto">
      <input
        type="text"
        placeholder="Search manga..."
        value={query}
        onChange={handleSearchChange}
        onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
        className="w-full py-2 px-4 rounded-lg bg-gray-200 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-900 dark:text-gray-100"
      />
      <button
        onClick={handleSearch}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 dark:bg-indigo-800 dark:hover:bg-indigo-900"
      >
        Search
      </button>
    </div>
  );
}
