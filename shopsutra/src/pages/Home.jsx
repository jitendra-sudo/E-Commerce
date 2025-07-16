import React, { useEffect, useState, useCallback } from 'react';
import Banner from '../compound/banner';
import TitleHeader from '../compound/titleHeader';
import Mapping from '../compound/Mapping';
import OurFeatures from '../compound/OurFeatures';
import LetterBox from '../compound/letterBox';
import Api from '../compound/Api';

function Home() {
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await Api.get('/');
      setProductData(response?.data || []);
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

  const latestCollection = productData?.filter((d) => d?.bestseller === true || d?.bestseller === 'true');
  const bestSeller = productData?.filter((d) => d?.newarrival === true || d?.newarrival === 'true');

  if (loading) {
    return <div className="py-10 text-center text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="py-10 text-center text-red-500">{error}</div>;
  }

  return (
    <div className='py-4'>
      <Banner />

      <div>
        <TitleHeader task1="Latest" task2="Collections" />
        <div className='flex justify-center items-center w-full py-1'>
          <p className='text-xs text-center text-gray-500'>
            Discover our latest trendy arrivals curated just for you.
          </p>
        </div>
        <Mapping data={latestCollection} />
      </div>

      <div>
        <TitleHeader task1="Best" task2="Sellers" />
        <div className='flex justify-center items-center w-full py-1'>
          <p className='text-xs text-center text-gray-500'>
            Explore our most loved and bestselling products.
          </p>
        </div>
        <Mapping data={bestSeller} />
      </div>
      <OurFeatures />
      <LetterBox />
    </div>
  );
}

export default Home;
