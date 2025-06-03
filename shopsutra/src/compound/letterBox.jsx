import React from 'react';

function LetterBox() {
    return (
        <div className="w-full bg-gray-50 py-6 px-4 xl:max-w-[66vw] mx-auto">
            <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-md md:text-base text-gray-700 font-medium">
                    Subscribe Now & Get <span className="text-blue-600 font-semibold">20% Off</span>
                </h2>
                <p className="text-xs md:text-sm text-gray-500 py-1">
                    Join our newsletter to stay updated with the latest offers and products.
                </p>
                <form className="mt-4">
                    <div className="flex  justify-center items-center  ">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="px-2 py-2 w-[90%] border border-gray-300 hover:outline-none  outline-none"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white  px-2 py-2  transition"
                        >
                            Subscribe
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LetterBox;
