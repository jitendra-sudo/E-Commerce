import { IoMdHeartEmpty } from "react-icons/io";

const ProductGrid = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 px-4 md:px-0 py-4 xl:max-w-[66vw] mx-auto">
      {data.map((item, index) => (
        <div
          key={index}
          className="relative bg-white rounded-lg overflow-hidden shadow-md border-[0.5px] border-gray-300 hover:shadow-xl transition-shadow duration-300 group"
        >
          <button className="absolute top-3 right-3 z-10 bg-white text-gray-700 rounded-full p-1 hover:bg-gray-200 transition-colors duration-300">
            <IoMdHeartEmpty className="text-xl" />
          </button>

          <div className="w-full">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full transform group-hover:scale-105 transition-transform duration-300  "
            />
          </div>

          <div className="py-3 px-2">
            <h2 className="text-[10px]  text-gray-800 mb-1 truncate ">
              {item.name}
            </h2>
            <span className="text-md font-bold text-gray-600">
              ₹ {item.price}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
