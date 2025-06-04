import React, { useEffect } from 'react'
import { FaSearch } from 'react-icons/fa'
import { IoClose } from "react-icons/io5";


function Searchbar({ status, setStatus }) {
   

    return (
        <>
            {status && (
                <div className="flex px-4 py-4 justify-center  items-center text-blue-100  w-full md:w-full  bg-gray-100 bg-opacity-90 backdrop-blur-md">
                    <div className='flex items-center justify-between  gap-8 max-w-2xl'>
                        <div className="flex items-center gap-1 border-2 bg-white border-black/20 rounded-3xl px-1.5 py-0.6">
                            <input
                                type="text"
                                placeholder="Search"
                                className="outline-none text-gray-500 text-sm p-1 w-full flex-1"
                            />
                            <button className="text-gray-500 hover:text-gray-700 px-2">
                                <FaSearch />
                            </button>
                        </div>

                        <button
                            className="text-gray-500 hover:bg-black/20 hover:backdrop-blur-md hover:bg-opacity-20 hover:text-white p-1 rounded-2xl"
                            onClick={() => setStatus(!status)}
                        >
                            <IoClose />
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

export default Searchbar;
