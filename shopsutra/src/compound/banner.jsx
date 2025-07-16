import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import banner1 from '../bannerIMg/banner1.jpg';
import banner2 from '../bannerIMg/banner2.jpg';
import banner3 from '../bannerIMg/banner3.jpg';
import banner4 from '../bannerIMg/banner4.jpg';
import banner5 from '../bannerIMg/banner5.jpg';

const Banner = () => {
  return (
    <div className="w-full">
      <div className="w-full  overflow-hidden">
        <Carousel
          autoPlay
          infiniteLoop
          showThumbs={false}
          showStatus={false}
          interval={3000}
          transitionTime={800}
          className="h-full"
        >
          <div>
            <img src={banner1} alt="Banner 1" className="object-cover w-auto h-[200px] md:h-[300px] lg:h-[400px]" />
          </div>
          <div>
            <img src={banner2} alt="Banner 2" className="object-cover w-full h-[200px] md:h-[300px] lg:h-[400px]" />
          </div>
          <div>
            <img src={banner3} alt="Banner 3" className="object-cover w-full h-[200px] md:h-[300px] lg:h-[400px]" />
          </div>
          <div>
            <img src={banner4} alt="Banner 4" className="object-cover w-full h-[200px] md:h-[300px] lg:h-[400px]" />
          </div>
          <div>
            <img src={banner5} alt="Banner 5" className="object-cover w-full h-[200px] md:h-[300px] lg:h-[400px]" />
          </div>
        </Carousel>
      </div>
    </div>
  );
};

export default Banner;
