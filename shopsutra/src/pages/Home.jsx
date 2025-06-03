import React from 'react'
import Banner from '../compound/banner'
import TitleHeader from '../compound/titleHeader'
import Assets from '../assets/assets';
import Mapping from '../compound/Mapping';
import OurFeatures from '../compound/OurFeatures';
import LetterBox from '../compound/letterBox';

function Home() {
  const LatestCollection = Assets.slice(4, 9)
  const bestSeller = Assets.slice(9, 14)

  return (
    <div className='py-4 '>
      <Banner />
      <div>
        <TitleHeader task1="Latest" task2="Collections" />
        <div className='flex justify-center items-center w-full py-1'>
          <h1 className='text-[10px] text-center text-gray-500'> lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. </h1>
        </div>
        <div>
          <Mapping data={LatestCollection} />
        </div>
      </div>
      <div>
        <TitleHeader task1="Best" task2="Sellers" />
        <div className='flex justify-center items-center w-full py-1'>
          <h1 className='text-[10px] text-center text-gray-500'> lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. </h1>
        </div>
        <div>
          <Mapping data={bestSeller} />
        </div>
      </div>

      <OurFeatures />
      <LetterBox />
    </div>
  )
}

export default Home
