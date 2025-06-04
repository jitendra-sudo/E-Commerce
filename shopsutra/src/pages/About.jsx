import React from 'react';
import { FaTruck, FaShieldAlt, FaThumbsUp, FaClock, FaUsers, FaBullseye, FaEye } from 'react-icons/fa'
import TitleHeader from '../compound/titleHeader';
import Abut from '../assets/about_img.png';
import LetterBox from '../compound/letterBox';

function About() {
  return (
    <section className="  bg-white text-gray-800">
      {/* Title */}
      <TitleHeader task1="About" task2="Us" />

      {/* Content */}
      <div className="flex flex-col md:flex-row items-center lg:items-start gap-2 lg:gap-8 pt-8">
        {/* Image Section */}
        <div className="sm:w-full md:w-auto">
          <img
            src={Abut}
            alt="About ShopSutra"
            className="h-[350px] w-full rounded-lg shadow-md"
          />
        </div>

        {/* Text Section */}
        <div className="w-full px-4 md:px-0 lg:w-1/2 space-y-6 ">
          {/* Who We Are */}
          <div>
            <h2 className="text-md font-semibold flex items-center gap-2 pb-2">
              <FaUsers className="text-blue-600" /> Who We Are
            </h2>
            <p className="text-[12px] text-gray-600 leading-relaxed">
              At <strong>ShopSutra</strong>, we believe in making your shopping experience seamless, affordable, and enjoyable.
            </p>
          </div>

          {/* Mission */}
          <div>
            <h2 className="text-md font-semibold flex items-center gap-2 pb-2 text-gray-800">
              <FaBullseye className="text-red-500" /> Our Mission
            </h2>
            <p className="text-[12px] text-gray-600 leading-relaxed">
              We are committed to providing our customers with the best online shopping experience by delivering value, trust, and care in every order.
            </p>
          </div>

          {/* Vision */}
          <div>
            <h2 className="text-md font-semibold flex items-center gap-2 pb-2 text-gray-800">
              <FaEye className="text-green-600" /> Our Vision
            </h2>
            <p className="text-[12px] text-gray-600 leading-relaxed">
              Our vision is to be the most customer-centric online shopping platform, where customers can find and discover anything they want to buy online.
            </p>
          </div>
        </div>
      </div>


      <div className="py-4">
        {/* Section Title */}
        <TitleHeader task1="Why " task2="Choose Us" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">

          <div className="bg-white shadow-md p-4 rounded-lg flex flex-col items-center text-center">
            <FaTruck className="text-blue-600 text-3xl mb-2" />
            <h3 className="font-semibold text-sm py-2">Fast Delivery </h3>
            <p className="text-[10px] text-gray-600">Get your products delivered quickly and safely, right to your door.</p>
          </div>

          <div className="bg-white shadow-md p-4 rounded-lg flex flex-col items-center text-center">
            <FaShieldAlt className="text-green-600 text-3xl mb-2" />
            <h3 className="font-semibold text-sm py-2">Secure Shopping </h3>
            <p className="text-[10px] text-gray-600">Your privacy and data are protected with top-notch security.</p>
          </div>

          <div className="bg-white shadow-md p-4 rounded-lg flex flex-col items-center text-center">
            <FaThumbsUp className="text-yellow-500 text-3xl mb-2" />
            <h3 className="font-semibold text-sm py-2">Quality Products </h3>
            <p className="text-[10px] text-gray-600">Only the best and most trusted brands for our customers.</p>
          </div>

        </div>
      </div>
      <div className="pt-4">
          <LetterBox />
      </div>
    </section>
  );
}

export default About;
