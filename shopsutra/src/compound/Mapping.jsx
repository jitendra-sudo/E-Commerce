import { IoMdHeartEmpty } from "react-icons/io";

const ProductGrid = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-[80px] py-4">
      {data.map((item, index) => (
        <div
          key={index}
          className="relative bg-white rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 group"
        >
          <button className="absolute top-3 right-3 z-10 bg-white text-gray-700 rounded-full p-1 hover:bg-gray-200 transition-colors duration-300">
            <IoMdHeartEmpty className="text-xl" />
          </button>

          <div className="overflow-hidden">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-center  transform group-hover:scale-105 transition-transform duration-300  "
            />
          </div>

          <div className="py-3 px-2">
            <h2 className="text-[11px]  text-gray-800 mb-1 ">
              {item.name}
            </h2>
            <span className="text-lg font-bold text-gray-600">
              ₹ {item.price}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
