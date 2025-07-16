import React, { useState, useEffect, useCallback } from 'react';
import { FaSearch } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import Api from './Api';
import { useNavigate } from 'react-router-dom';

function Searchbar({ status, setStatus }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Fetch all products once
  const fetchData = useCallback(async () => {
    try {
      const response = await Api.get('/');
      setProducts(response?.data || []);
    } catch (err) {
      console.error('Failed to fetch products');
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    const matched = products.filter((product) =>
      product.name.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(value ? matched.slice(0, 5) : []);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setSuggestions([]); // Hide dropdown
    setStatus(false);   // Close searchbar
    setQuery('');
  };

  const handleSelect = (item) => {
    setQuery('');
    setSuggestions([]); // Hide suggestions immediately
    setStatus(false);   // Close searchbar
    navigate(`/search?q=${encodeURIComponent(item.name)}`);
  };

  return (
    status && (
      <div className="flex px-4 py-4 justify-center items-center w-full bg-gray-100 bg-opacity-90 backdrop-blur-md">
        <div className="relative w-full max-w-2xl">
          {/* Search input */}
          <form onSubmit={handleSubmit} className="flex items-center border-2 bg-white border-black/20 rounded-3xl px-3 py-1.5">
            <input
              type="text"
              value={query}
              onChange={handleSearch}
              placeholder="Search"
              className="outline-none text-gray-500 text-sm w-full"
            />
            <button type="submit" className="text-gray-500 hover:text-gray-700 px-2">
              <FaSearch />
            </button>
          </form>

          {/* Suggestions dropdown */}
          {query && suggestions.length > 0 && (
            <ul
              className="absolute z-10 w-full mt-1 bg-white border rounded shadow text-sm"
              onMouseLeave={() => setSuggestions([])} // Optional
            >
              {suggestions.map((item) => (
                <li
                  key={item._id}
                  onClick={() => handleSelect(item)}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                >
                  {item.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Close button */}
        <button
          className="ml-4 text-gray-500 hover:bg-black/20 hover:text-white p-1 rounded-2xl"
          onClick={() => {
            setStatus(false);
            setQuery('');
            setSuggestions([]);
          }}
        >
          <IoClose />
        </button>
      </div>
    )
  );
}

export default Searchbar;
