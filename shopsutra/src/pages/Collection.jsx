import React, { useEffect, useState, useCallback } from 'react';
import TitleHeader from '../compound/titleHeader';
import Mapping from '../compound/Mapping';
import Api from '../compound/Api';

function Collection() {
  const [productData, setProductData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState('relevant');

  const [filters, setFilters] = useState({
    category: [],
    subcategory: [],
    brand: [],
  });

  const fetchData = useCallback(async () => {
    try {
      const response = await Api.get('/');
      setProductData(response?.data || []);
      setFilteredData(response?.data || []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle checkbox changes
  const handleFilterChange = (type, value) => {
    setFilters((prev) => {
      const updated = prev[type].includes(value)
        ? prev[type].filter((v) => v !== value)
        : [...prev[type], value];
      return { ...prev, [type]: updated };
    });
  };

  // Filter + Sort logic
  useEffect(() => {
    let filtered = [...productData];

    if (filters.category.length > 0) {
      filtered = filtered.filter((item) => filters.category.includes(item.category));
    }
    if (filters.subcategory.length > 0) {
      filtered = filtered.filter((item) => filters.subcategory.includes(item.subcategory));
    }
    if (filters.brand.length > 0) {
      filtered = filtered.filter((item) => filters.brand.includes(item.brand));
    }

    if (sortOption === 'high-to-low') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'low-to-high') {
      filtered.sort((a, b) => a.price - b.price);
    }

    setFilteredData(filtered);
  }, [filters, productData, sortOption]);

  const categories = ["Men", "Women", "Kids"];
  const subcategories = ["Topwear", "Bottom Wear", "Winter Wear", "T-Shirts"];
  const brands = ["Gucci", "Puma", "Titan", "nice"];

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-64 mt-10 py-8 px-6 hidden md:flex md:flex-col gap-4">
        <h1 className="text-2xl font-semibold mb-4">Filter</h1>
        <div className="border border-gray-300 py-3 px-4 rounded-2xl">
          <p className="font-medium mb-2">Categories</p>
          <ul className="space-y-2">
            {categories.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`category-${item}`}
                  checked={filters.category.includes(item)}
                  onChange={() => handleFilterChange('category', item)}
                />
                <label htmlFor={`category-${item}`}>{item}</label>
              </li>
            ))}
          </ul>
        </div>

        <div className="border border-gray-300 py-3 px-4 rounded-2xl">
          <p className="font-medium mb-2">Type</p>
          <ul className="space-y-2">
            {subcategories.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`subcategory-${item}`}
                  checked={filters.subcategory.includes(item)}
                  onChange={() => handleFilterChange('subcategory', item)}
                />
                <label htmlFor={`subcategory-${item}`}>{item}</label>
              </li>
            ))}
          </ul>
        </div>

        <div className="border border-gray-300 py-3 px-4 rounded-2xl">
          <p className="font-medium mb-2">Brands</p>
          <ul className="space-y-2">
            {brands.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`brand-${item}`}
                  checked={filters.brand.includes(item)}
                  onChange={() => handleFilterChange('brand', item)}
                />
                <label htmlFor={`brand-${item}`}>{item}</label>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex-1 px-4 pt-6">
        <TitleHeader task1="All" task2="Collections" />
        <div className="relative flex justify-end pt-2 md:pt-0">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className=" bg-gray-100 border border-gray-300 text-[11px] md:text-sm rounded py-1 px-2 focus:outline-none"
          >
            <option value="relevant">Sort By: Relevant</option>
            <option value="high-to-low">Sort By: High to Low</option>
            <option value="low-to-high">Sort By: Low to High</option>
          </select>
        </div>

        <div className="">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : filteredData.length === 0 ? (
            <p className="text-center text-gray-400">No products found.</p>
          ) : (
            <Mapping data={filteredData} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Collection;
