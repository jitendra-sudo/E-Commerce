import React, { useState, useEffect, useRef } from "react";
import logo from "../assets/logoshopSutra.png";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { FaShoppingBag, FaHome, FaInfoCircle, FaPhone, FaThList, FaHeart } from "react-icons/fa";
import { BsList } from "react-icons/bs";
import Avatar from '@mui/material/Avatar';
import { FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import Searchbar from "./searchbar";
import { useDispatch, useSelector } from "react-redux";
import Register from "./Register";
import { toast } from "react-toastify";
import Logout from '../compound/logout';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sliderOpen, setSliderOpen] = useState(false);
  const [status, setStatus] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [showRegister, setShowRegister] = useState(false);
  const token = localStorage.getItem('token');
  const profilePicture = localStorage.getItem('profilePicture');
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, resData, } = useSelector((state) => state.auth);

  useEffect(() => {
    if (location.pathname === '/collection') {
      setStatus(true);
    } else {
      setStatus(false);
    }
  }, [location.pathname]);


  const navItems = [
    { path: "/", label: "Home", icon: <FaHome /> },
    { path: "/collection", label: "Collection", icon: <FaThList /> },
    { path: "/about", label: "About", icon: <FaInfoCircle /> },
    { path: "/contact", label: "Contact", icon: <FaPhone /> },
  ];


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  return (
    <>
      <Register showModal={showRegister} setShowModal={setShowRegister} />

      <div className="text-white py-4 flex justify-between items-center font-poppins relative z-50">
        <div className="w-20">
          <img src={logo} alt="Logo" className="h-full" onClick={() => navigate("/")} />
        </div>

        <ul className="hidden text-gray-700 gap-8 lg:flex text-sm">
          {navItems.map(({ path, label }) => (
            <li key={path}>
              <NavLink
                to={path}
                className="flex group flex-col gap-1 items-center text-gray-700 hover:text-gray-900"
              >
                <p>{label}</p>
                <hr className="w-2/4 h-[1.5px] bg-t group-hover:bg-gray-700 border-none" />
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex justify-end items-center gap-4 md:gap-8">
          <button onClick={() => setStatus(!status)} >
            <FaSearch className="h-4 w-4 text-gray-500 mx-2" />
          </button>



          <NavLink
            to="/orders"
            className="hidden lg:flex group flex-col text-sm gap-1 items-center text-gray-700 hover:text-gray-900"
          >
            <p>Orders</p>
            <hr className="w-2/4 h-[1.5px] bg-t group-hover:bg-gray-700 border-none" />
          </NavLink>

          <NavLink
            to="/cart"
            className="group hidden lg:block text-gray-700 hover:text-gray-900 relative"
          >
            <FaShoppingBag className="h-6 w-7" />
            <span className="absolute bg-gray-700 group-hover:bg-gray-900 text-white text-xs rounded-full top-[13px] -right-1 px-1">
              {cartItems.length > 0 ? cartItems.length : 0}
            </span>
          </NavLink>

          {/* Avatar Dropdown */}
          <div ref={dropdownRef} onClick={() => { if (!token) { setShowRegister(true); } else { setDropdownOpen(true); } }} className="flex flex-col items-center text-gray-700 hover:text-gray-900 relative cursor-pointer" >
            <Avatar src={profilePicture || user?.profilePicture} sx={{ height: 32, width: 32 }} alt="User" />
            {token && dropdownOpen && (

              <div className="absolute right-0 my-9 w-40 rounded-xl bg-white shadow-lg ring-1 ring-gray-200 z-50 p-4">
                <ul className="text-gray-700 flex flex-col gap-2">

                  <li className=" ">
                    <NavLink to="/profile"
                      className="block text-gray-900 hover:text-white transition duration-150 border hover:border-transparent rounded-md p-1 px-4 hover:bg-black/90 backdrop-blur-md"      >
                      Profile
                    </NavLink>
                  </li>
                  <li className=" ">
                    <NavLink to="/wishlist"
                      className="block text-gray-900 hover:text-white transition duration-150 border hover:border-transparent rounded-md p-1 px-4 hover:bg-black/90 backdrop-blur-md"      >
                      Wishlist
                    </NavLink>
                  </li>

                  {resData?.role == 'admin' &&
                    <li>
                      <NavLink to="/dashboard"
                        className="block text-gray-900 hover:text-white transition duration-150 border hover:border-transparent rounded-md p-1 px-4 hover:bg-black/90 backdrop-blur-md"   >
                        Dashboard
                      </NavLink>
                    </li>
                  }
                  <li>
                    <NavLink to="/settings"
                      className="block text-gray-900 hover:text-white transition duration-150 border hover:border-transparent rounded-md p-1 px-4 hover:bg-black/90 backdrop-blur-md"   >
                      Settings
                    </NavLink>
                  </li>
                  <li>
                    <button
                      onClick={(e) => { e.stopPropagation(); setDropdownOpen(false); Logout(dispatch); }}
                      className="block w-full text-red-900 hover:text-white transition duration-150 border hover:border-transparent rounded-md p-1 px-4 hover:bg-red-900/90 backdrop-blur-md" >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>


          <button
            onClick={() => setSliderOpen(true)}
            className="text-gray-700 hover:text-gray-900 lg:hidden"
          >
            <BsList className="h-6 w-6" />
          </button>
        </div>

        {sliderOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/30 bg-opacity-40 z-40"
              onClick={() => setSliderOpen(false)}
            ></div>

            {/* Slider Menu */}
            <div className="fixed top-0 right-0 w-[220px] h-full rounded-tl-2xl rounded-bl-2xl bg-white z-50 shadow-xl p-5 transition-transform duration-300">
              <button onClick={() => setSliderOpen(false)} className="text-gray-600 hover:text-white hover:bg-gray-400 hover:bg-opacity-30 p-0.5 rounded-[50%]  absolute top-3 right-3"  >
                <IoClose size={24} />
              </button>
              <ul className="mt-15 space-y-2">

                {navItems.map(({ path, label, icon }) => (
                  <li key={path} className="flex items-center gap-3 text-gray-700 border border-gray-600 hover:border-t-transparent px-3 py-[6px] rounded-lg transition-all duration-200 hover:bg-black/30 hover:text-white">
                    {icon}
                    <NavLink to={path} onClick={() => setSliderOpen(false)}>
                      {label}
                    </NavLink>
                  </li>
                ))}
                <li className="flex items-center gap-3 text-gray-700 border border-gray-600 hover:border-t-transparent px-3 py-[6px] rounded-lg transition-all duration-200 hover:bg-black/30 hover:text-white">
                  <FaHeart />
                  <NavLink to='/wishlist' onClick={() => setSliderOpen(false)}>
                    Wishlist
                  </NavLink>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
      <div>
        {/* Search Bar */}
        <Searchbar status={status} setStatus={setStatus} />
      </div>
    </>

  );
};

export default Navbar;
