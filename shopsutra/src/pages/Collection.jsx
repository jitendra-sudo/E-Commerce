import React, { } from 'react'
import TitleHeader from '../compound/titleHeader'
import Assets from '../assets/assets';
import Mapping from '../compound/Mapping';

function Collection() {

  return (
    <div className=" flex">
      {/* Sidebar Filter */}
      <div className="w-64 py-18 hidden md:flex px-6  md:flex-col gap-2">
        <h1 className="text-2xl font-semibold mb-6">Filter</h1>

        {/* Categories */}
        <div className='border border-gray-300 py-2 px-4 rounded-2xl'>
          <p className="font-medium mb-2">Categories</p>
          <ul className="space-y-2">
            {["Men", "Woman", "Kids"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <input type="checkbox" id={item} />
                <label htmlFor={item}>{item}</label>
              </li>
            ))}
          </ul>
        </div>

        {/* Types */}
        <div className='border border-gray-300 py-2 px-4  rounded-2xl'>
          <p className="font-medium mb-2">Type</p>
          <ul className="space-y-2">
            {["Topwear", "Bottom Wear", "Winter Wear"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <input type="checkbox" id={item} />
                <label htmlFor={item}>{item}</label>
              </li>
            ))}
          </ul>
        </div>

        {/* Brands */}
        <div className='border border-gray-300 py-2 px-4 rounded-2xl'>
          <p className="font-medium mb-2">Brands</p>
          <ul className="space-y-2">
            {["Gucci", "Puma", "Titan"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <input type="checkbox" id={item} />
                <label htmlFor={item}>{item}</label>
              </li>
            ))}
          </ul>
        </div>

      </div>


      <div className="flex-1 ">
        <div className="relative mb-4">
          <TitleHeader task1="All" task2="Collections"/>
        </div>
        <div className='relative'>
          <select
            className="absolute right-0 top-0 bg-gray-100 border border-gray-300 text-[11px] md:text-sm  rounded mx-2 py-1 focus:outline-none"
          >
            <option>Sort By: Relevant</option>
            <option>Sort By: High to Low</option>
            <option>Sort By: Low to High</option>
          </select>

          <div className='pt-8'>
            <Mapping data={Assets} />
          </div>
        </div>
      </div>
    </div>

  )
}

export default Collection
