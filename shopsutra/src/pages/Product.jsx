import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function Product() {
  const location = useLocation();
  const item = location.state;
  const [rating, setRating] = useState(3.5);
  const [selectedSize, setSelectedSize] = useState(null);
  console.log(item)


  const [reviewImg, setReviewImg] = useState('');

  useEffect(() => {
    if (item?.image?.length > 0) {
      setReviewImg(item.image[0]);
    }
  }, [item]);

  if (!item || !item.image) {
    return (
      <div className='flex justify-center items-center '>
        <p>No product data found</p>
      </div>
    )
  }



  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating - fullStars >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-500 text-xl">★</span>);
    }

    if (hasHalf) {
      stars.push(<span key="half" className="text-yellow-500 text-xl">☆</span>);
    }

    while (stars.length < 5) {
      stars.push(<span key={stars.length} className="text-gray-300 text-xl">★</span>);
    }
    return stars;
  }

  return (
    <div className='py-8 block lg:flex gap-2'>
      {/* left */}
      <div className='flex w-1/2'>
        <div className='flex flex-col justify-between gap-2 max-h-118 overflow-y-auto'>
          {item?.image?.map((img, index) => (
            <img key={index} src={img} onClick={() => setReviewImg(img)} alt='thumbnail' className='w-auto h-26 object-cover cursor-pointer' />
          ))}
        </div>

        <div className='ml-4'>
          <img src={reviewImg} className='w-full h-auto object-contain' />
        </div>
      </div>

      {/* right */}
      <div className=''>
        <h1 className='text-2xl text-black font-bold' >{item?.name}</h1>
        {/* Product Review  */}
        <div className='py-1'>
          {rating !== null ? (
            <div className="flex items-center">{renderStars(rating)} <span className="ml-2 text-sm text-gray-600">({rating.toFixed(1)} out of 5)</span></div>
          ) : (
            <p>Loading rating...</p>
          )}
        </div>
        <p className='text-3xl font-bold py-5 px-4'>₹ {item?.price}</p>
        <p className='text-gray-500 '>{item?.description}</p>

        <div>
          <p className='text-lg text-black font-bold py-2'>Select Size</p>
          <div className='flex gap-1 flex-wrap py-1'>
            {item.sizes.map((size) => (
              <button key={size} onClick={() => setSelectedSize(size)} className={`border  px-4 py-2 rounded-md cursor-pointer transition 
              ${selectedSize === size ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`} >
                {size}
              </button>
            ))}
          </div>

        </div>
        <div className='flex gap-2 mt-4 '>
          <button className='bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition'>
            Add to Cart
          </button>
          <button className='bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600 transition'>
            Buy Now
          </button>
        </div>
            
        <div className="text-sm text-gray-700 space-y-1 mt-4">
        <hr className='text-gray-300 py-2'/>
          <p>100% Original product.</p>
          <p>Cash on delivery is available on this product.</p>
          <p>Easy return and exchange policy within 7 days.</p>
        </div>

      </div>
    </div>
  );
}

export default Product;
