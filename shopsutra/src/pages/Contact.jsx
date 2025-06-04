import React from 'react';
import TitleHeader from '../compound/titleHeader';
import ContactImg from '../assets/contact_img.png';
import LetterBox from '../compound/letterBox';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaBriefcase } from 'react-icons/fa';

function Contact() {
  return (
    <div className="px-4 md:px-8 lg:px-16  bg-white text-gray-800">
      {/* Header */}
      <TitleHeader task1="Contact" task2="Us" />

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 pt-8">
        {/* Left: Image */}
        <div className="w-full md:w-auto">
          <img
            src={ContactImg}
            alt="Contact ShopSutra"
            className="h-[350px] w-auto rounded-lg shadow-md"
          />
        </div>

        {/* Right: Contact Info */}
        <div className="w-full lg:w-1/2 space-y-6">
          <h2 className="text-lg font-semibold">Get in Touch</h2>
          <p className="text-sm text-gray-600">
            We'd love to hear from you! Reach out with any questions, feedback, or just to say hi 👋.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-blue-500 mt-1" />
              <span className="text-sm text-gray-700">
                123 Market Street, Bansur, Alwar, Rajasthan - 301402
              </span>
            </div>
            <div className="flex items-start gap-3">
              <FaPhoneAlt className="text-green-500 mt-1" />
              <a href="tel:+911234567890" className="text-sm text-gray-700 hover:text-blue-600">
                +91 12345 67890
              </a>
            </div>
            <div className="flex items-start gap-3">
              <FaEnvelope className="text-red-500 mt-1" />
              <a href="mailto:support@shopsutra.com" className="text-sm text-gray-700 hover:text-blue-600">
                support@shopsutra.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* LetterBox Form */}
      <div className="pt-10">
        <LetterBox />
      </div>


      <div className="pt-12  mt-10">
        <div className="flex items-center justify-center gap-2 py-4">
          <FaBriefcase className="text-purple-600" size={20} />
          <h2 className="text-lg font-bold">Explore Job Opportunities</h2>
        </div>
        <div className='flex items-center justify-center'>
          <p className="text-[12px] md:text-sm text-gray-600 text-center max-w-2xl">
            Want to be a part of the ShopSutra team? We’re always looking for passionate individuals who love technology, e-commerce, and innovation. 💼
            <br />
            Drop your resume or job-related queries at{' '}
            <a href="mailto:careers@shopsutra.com" className="text-blue-600 underline">
              careers@shopsutra.com
            </a>{' '}
            and we’ll get back to you!
          </p>
        </div>

      </div>

    </div>
  );
}

export default Contact;
