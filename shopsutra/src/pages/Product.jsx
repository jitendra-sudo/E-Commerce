import React, { useState, useEffect } from 'react';
import { useLocation,useNavigate  } from 'react-router-dom';
import ReviewModal from '../compound/review'
import { useDispatch, useSelector  } from 'react-redux';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';

function Product() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const location = useLocation();
  const navigate = useNavigate();
  const item = location.state;
  const [rating, setRating] = useState(3.5);
  const [selectedSize, setSelectedSize] = useState(null);
  const [select, setSelect] = useState(true)
  const [showModal, setShowModal] = useState(false);
  const [reviewImg, setReviewImg] = useState('');

  const [reviews, setReviews] = useState([
    { user: 'John Doe', comment: 'Great product!', rating: 4.2 },
    { user: 'Jane Smith', comment: 'Very useful and good quality.', rating: 3.2 }
  ]);

  const [formData, setFormData] = useState({ comment: '', rating: 0 });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.rating && formData.comment) {
      setReviews([...reviews, formData]);
      setFormData({ rating: '', comment: '' });
      setShowModal(false);
    }
  };

  console.log(item)

  useEffect(() => {
    if (item?.image?.length > 0) {
      setReviewImg(item.image[0]);
    }
  }, [item]);

  if (!item || !item.image) {
    return (
      <div className='flex justify-center items-center'>
        <p>No product data found</p>
      </div>
    );
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
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size before adding to cart.');
      return;
    }

    const uniqueItem = { ...item, selectedSize, _id: `${item._id}-${selectedSize}` };
    dispatch(addToCart(uniqueItem));
    toast.success("✅ Added to cart successfully!");
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      alert("Please select a size before buying.");
      return;
    }
    dispatch(addToCart({ ...item, selectedSize }));
    navigate('/cart');
  };

  return (
    <div className='py-8 px-2 md:px-4 lg:px-0'>
      <div className=' block lg:flex gap-4 '>
        {/* left */}
        <div className='flex flex-col-reverse md:flex-row h-full w-full md:w-full xl:w-[70%] md:gap-13 lg:gap-2 gap-3 px-0 md:px-12 lg:px-0 pb-8'>
          <div className='flex flex-row  md:flex-col justify-between gap-1'>
            {item?.image?.map((img, index) => (
              <img
                key={index}
                src={img}
                onClick={() => setReviewImg(img)}
                alt='thumbnail'
                className={`w-auto h-20 md:h-28 rounded-sm object-cover cursor-pointer ${img === reviewImg ? 'border border-gray-300' : ''}`}
              />
            ))}
          </div>

          <div className='ml-0 md:ml-4'>
            <img src={reviewImg} className='w-full h-full rounded-sm' />
          </div>
        </div>

        {/* Right section */}
        <div className='w-full'>
          <h1 className='text-xl xl:text-2xl text-black font-bold'>{item?.name}</h1>
          <div className='py-1'>
            {rating !== null ? (
              <div className="flex items-center">
                {renderStars(rating)}
                <span className="ml-2 text-sm text-gray-600">({rating.toFixed(1)} out of 5)</span>
              </div>
            ) : (
              <p>Loading rating...</p>
            )}
          </div>
          <p className='text-3xl font-bold py-3 px-4'>₹ {item?.price}</p>
          <p className='text-gray-500 text-[12px] xl:text-md'>{item?.description}</p>

          <div>
            <p className='text-lg text-black font-bold py-1'>Select Size</p>
            <div className='flex gap-1 flex-wrap py-1'>
              {item.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`border px-3 py-1 rounded-md cursor-pointer transition 
                    ${selectedSize === size ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className='flex gap-2 mt-4'>
            <button
              className='bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition'
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
            <button
              className='bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600 transition'
              onClick={handleBuyNow}
            >
              Buy Now
            </button>
          </div>

          <div className="text-sm text-gray-700 space-y-1 mt-4">
            <hr className='text-gray-300 py-2' />
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>
      <div className='py-4'>
        <div className='flex border-b border-gray-300'>
          <button
            onClick={() => setSelect(true)}
            className='border-gray-700 border text-gray-700 px-4 py-2 rounded hover:border-black hover:text-black transition'
          >
            Description
          </button>
          <button
            onClick={() => setSelect(false)}
            className='border-gray-700 border text-gray-700 px-4 py-2 rounded hover:border-black hover:text-black transition'
          >
            Reviews
          </button>
        </div>

        <div className='py-2'>
          {select ? (
            <div>
              <p className='text-gray-500 text-sm'>{item.description}</p>
            </div>
          ) : (
            <div>
              <div className='flex justify-end'>
                <button onClick={() => setShowModal(true)} className='text-gray-800 font-bold hover:text-gray-500  py-2 ' >
                  Add Review
                </button>
              </div>


              {reviews.length > 0 ? (
                reviews.map((rev, idx) => (
                  <div key={idx} className='mb-4 border-b pb-3 flex items-start gap-3'>
                    <Avatar>
                      {rev.user?.charAt(0).toUpperCase()}
                    </Avatar>

                    <div>
                      <p className='font-semibold'>{rev.user}</p>

                      <div className="flex items-center">{renderStars(rev.rating)} <span className="ml-2 text-sm text-gray-600">({rev.rating.toFixed(1)} out of 5)</span></div>
                      <p className='text-sm text-gray-600 mt-1'>{rev.comment}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className='text-sm text-gray-500'>No reviews yet.</p>
              )}
            </div>
          )}
        </div>

        <ReviewModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
        />
      </div>
    </div>
  );
}

export default Product;
