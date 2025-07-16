import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Api from '../compound/Api';
import Mapping from '../compound/Mapping'; 
import TitleHeader from '../compound/titleHeader'; 

function SearchPage() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q')?.toLowerCase() || '';
  const [filteredData, setFilteredData] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sortOption, setSortOption] = useState('relevant');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await Api.get('/');
        setProducts(res.data);
      } catch (err) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchQuery && products.length > 0) {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery)
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(products);
    }
  }, [searchQuery, products]);

  return (
    <div className="flex flex-col md:flex-row">
      <div className="flex-1 px-4 pt-6">
        <TitleHeader task1="Search" task2="Results" />

        <div className="relative flex justify-end pt-2 md:pt-0">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-gray-100 border border-gray-300 text-sm rounded py-1 px-2"
          >
            <option value="relevant">Sort By: Relevant</option>
            <option value="high-to-low">Sort By: High to Low</option>
            <option value="low-to-high">Sort By: Low to High</option>
          </select>
        </div>

        <div className="mt-4">
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

export default SearchPage;
