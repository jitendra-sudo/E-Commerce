import React from 'react';
import { RiExchangeFundsLine } from "react-icons/ri";
import { MdOutlineVerified } from "react-icons/md";
import { BiSupport } from "react-icons/bi";

const features = [
    {
        icon: <RiExchangeFundsLine size={60} className="text-blue-600" />,
        title: "Easy Exchange Policy",
        description: "We offer a hassle-free exchange policy for your convenience.",
    },
    {
        icon: <MdOutlineVerified size={60} className="text-green-600" />,
        title: "7 Days Return Policy",
        description: "Enjoy a 7-day return policy with no questions asked.",
    },
    {
        icon: <BiSupport size={60} className="text-purple-600" />,
        title: "Best Customer Support",
        description: "Our team is always ready to help with excellent support.",
    },
];

function OurFeatures() {
    return (
        <div className="py-12 bg-white">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                    {features.map((feature, index) => (
                        <div key={index} className="flex flex-col items-center p-6"   >
                            {feature.icon}
                            <p className="mt-4 text-base font-medium text-gray-700">{feature.title}</p>
                            <p className="mt-2 text-sm text-gray-500">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default OurFeatures;
