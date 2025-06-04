import React from 'react'
import TitleHeader from '../compound/titleHeader'
import Abut from '../assets/about_img.png'

function About() {
  return (
    <div className=''>
      <TitleHeader task1="About" task2="Us" />
      <div className='flex pt-8 gap-4'>
        <div>
          <img src={Abut} alt="About" className='h-[50%] rounded-lg'/>
        </div>
        <div className='border'>
             
        </div>

      </div>

    </div>
  )
}

export default About
