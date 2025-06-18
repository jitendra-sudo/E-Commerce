import React from 'react';
import Rating from '@mui/material/Rating';

function ReviewModal({ show, onClose, onSubmit, formData, setFormData }) {
  if (!show) return null;

  const handleClickOutside = (e) => {
    if (e.target.id === 'modalBackdrop') onClose();
  };

  return (
    <div id="modalBackdrop" onClick={handleClickOutside} className='fixed inset-0 bg-black/30 bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-md' >
      <div className='bg-white p-6 rounded shadow-lg w-80' onClick={(e) => e.stopPropagation()}>
        <h2 className='text-lg font-bold mb-4'>Write a Review</h2>
        <form onSubmit={onSubmit}>
          {/* Star Rating */}
          <div className="mb-3">
            <Rating name="rating" value={formData.rating} onChange={(event, newValue) => setFormData({ ...formData, rating: newValue })} />
          </div>


          <textarea placeholder='Your review' value={formData.comment} onChange={(e) => setFormData({ ...formData, comment: e.target.value })} className='w-full border px-2 py-1 mb-3 rounded' rows='3' required   ></textarea>
          <div className='flex justify-end gap-2'>
            <button type='button' onClick={onClose} className='text-gray-500'>
              Cancel
            </button>
            <button type='submit' className='bg-black text-white px-3 py-1 rounded'>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReviewModal;
