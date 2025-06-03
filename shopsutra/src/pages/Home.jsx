import React from 'react'
import Banner from '../compound/banner'
import TitleHeader from '../compound/titleHeader'
import Assets from '../assets/assets';
import Mapping from '../compound/Mapping';

function Home() {
     const LatestCollection = Assets.slice(4, 8)
     
  return (
    <div className='py-4'>
      <Banner />
      <TitleHeader task1="Latest" task2="Collections" />
      <div className='flex justify-center items-center w-full py-1'>
      <h1 className='text-[10px] text-gray-500'> lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. </h1>
      </div>
      <div>
        <Mapping data={LatestCollection} />
      </div>
    </div>
  )
}

export default Home
