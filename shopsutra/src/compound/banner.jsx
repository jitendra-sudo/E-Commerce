import React from 'react'
import Assets from '../assets/hero_img.png'

function banner() {
    return (
        <div className='flex justify-center items-center w-full px-3 md:px-8 py-4'>
            <div className='flex flex-col md:flex-row border-1 border-gray-400 justify-between items-center gap-4 md:gap-8'>
                <div className='flex justify-center items-center py-12 w-full '>
                    <div className='w-full md:w-[400px] gap-3 flex flex-col justify-center'>
                        <div className='flex  items-center justify-center w-full'>
                            <h1 className="px-2 font-outfit " style={{fontFamily:"Outfit"}}>
                                <span className="text-gray-400">Best</span>{' '}
                                <span className="text-black">Sellers</span>
                            </h1>
                            <p className='w-[10%] h-[2px] bg-black'></p>
                        </div>

                        <p className=' text-gray-500 text-4xl  text-center' style={{fontFamily:"prata"}}>Latest Arrivals</p>

                        <div className='flex  items-center justify-center w-full font-outfit' style={{fontFamily:"Outfit"}}>
                            <p className='w-[10%] h-[2px] bg-black'></p>
                            <h1 className=" px-2">
                                <span className="text-gray-400">Show</span>{' '}
                                <span className="text-black">Now</span>
                            </h1>

                        </div>
                    </div>
                </div>

                <div className='w-full' >
                    <img src={Assets} alt='Featured' className='w-80' />
                </div>

            </div>
        </div>
    )
}

export default banner
