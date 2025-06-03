import React from 'react'

function titleHeader({ task1, task2 }) {
    return (
        <div className='flex  items-center justify-center w-full pt-8'>
            <h1 className="px-2 text-2xl font-outfit " style={{ fontFamily: "Outfit" }}>
                <span className="text-gray-400">{task1}</span>{' '}
                <span className="text-black">{task2}</span>
            </h1>
            <p className='w-[10%] h-[2px] bg-black'></p>
        </div>
    )
}

export default titleHeader;
