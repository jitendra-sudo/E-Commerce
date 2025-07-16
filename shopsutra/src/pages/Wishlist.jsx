import React , {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoMdHeartEmpty } from 'react-icons/io';
import { addToWishlist, fetchWishlist } from '../ContextApi/WishListSlice';
import { useNavigate } from 'react-router-dom';

function Wishlist() {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.wishlist);
  console.log(items)
  const navigate = useNavigate();

  const handleFavourite = async (id) => {
    await dispatch(addToWishlist(id));
    await dispatch(fetchWishlist());
  };

  const handlePreviewPage = (item) => {
        navigate(`/product/${item._id}`, { state: item });
  };

   if(items?.length === 0) {
  return  <div className='flex justify-center items-center w-full h-[80vh]'>
       <p className=" text-gray-500">No items found</p> 
       </div>
   } 

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4  w-full h-[80vh]">
      {items?.map((item, index) => {
        const isFavourite = true; 

        return (
          <div
            key={item._id}
            onClick={() => handlePreviewPage(item)}
            className="relative  bg-white rounded-lg overflow-hidden shadow-md border border-gray-300 hover:shadow-xl transition duration-300 transform hover:scale-105"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleFavourite(item._id);
              }}
              className="absolute top-3 right-3 z-10 bg-white text-gray-700 rounded-full p-1 hover:bg-gray-200 transition-colors duration-300"
            >
              <IoMdHeartEmpty className={`text-xl ${isFavourite ? 'text-red-500' : ''}`} />
            </button>

            <div className="w-full">
              <img
                src={item?.image?.[0]}
                alt={item?.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="py-3 px-2">
              <h2 className="text-sm font-medium text-gray-800 truncate">
                {item?.name || '-'}
              </h2>
              <span className="text-md font-bold text-gray-600">
                ₹ {item?.price || '-'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Wishlist;
