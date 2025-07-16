import { useEffect, useState } from "react";
import { IoMdHeartEmpty } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, fetchWishlist } from '../ContextApi/WishListSlice';

const ProductGrid = ({ data }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.wishlist);
  const handlePreviewPage = (item) => {
    navigate(`/product/${item._id}`, { state: item });
  };
 
  const handleFavourite = async(id) => {
    await dispatch(addToWishlist(id));
    await  dispatch(fetchWishlist())
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 px-4 md:px-0 py-4  mx-auto">
      {data?.map((item, index) => {
        const isFavourite = items?.some(data => data._id === item._id);
        return (
          <div key={index} onClick={() => { handlePreviewPage(item) }} className="relative bg-white rounded-lg overflow-hidden shadow-md border-[0.5px] border-gray-300 hover:shadow-xl transition-shadow duration-300 transform hover:scale-103">
            <button onClick={(e) => { e.stopPropagation(); handleFavourite(item?._id); }} className="absolute top-3 right-3 z-10 bg-white text-gray-700 rounded-full p-1 hover:bg-gray-200 transition-colors duration-300">
              {isFavourite ? (
                <IoMdHeartEmpty className="text-xl text-red-500" />
              ) : (
                <IoMdHeartEmpty className="text-xl" />
              )}
            </button>

            <div className="w-full">
              <img src={item?.image[0]} alt={item?.name} className="w-full h-full" />
            </div>

            <div className="py-3 px-2">
              <h2 className="text-[10px]  text-gray-800 mb-1 truncate ">
                {item?.name || '-'}
              </h2>
              <span className="text-md font-bold text-gray-600">
                ₹ {item?.price || '-'}
              </span>
            </div>
          </div>)
      }
      )}
    </div>
  );
};

export default ProductGrid;
