import React, { useState, useEffect } from "react";
import logo from "../assets/logoshopSutra.png";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { FaShoppingBag, FaHome, FaInfoCircle, FaPhone, FaThList } from "react-icons/fa";
import { BsList } from "react-icons/bs";
import Avatar from '@mui/material/Avatar';
import { FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import Searchbar from "./searchbar";
const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sliderOpen, setSliderOpen] = useState(false);
  const [status, setStatus] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    if (location.pathname === '/') {
      setStatus(false);
    } else {
      setStatus(true);
    }
  }, [location.pathname]);


  const navItems = [
    { path: "/", label: "Home", icon: <FaHome /> },
    { path: "/collection", label: "Collection", icon: <FaThList /> },
    { path: "/about", label: "About", icon: <FaInfoCircle /> },
    { path: "/contact", label: "Contact", icon: <FaPhone /> },
  ];

  return (
    <>
      <div className="text-white py-4 flex justify-between items-center font-poppins relative z-50">
        {/* Logo */}
        <div className="w-20">
          <img src={logo} alt="Logo" className="h-full" />
        </div>

        {/* Desktop Nav */}
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

        {/* Right Controls */}
        <div className="flex justify-end items-center gap-4 md:gap-8">
          {/* Search */}
          <button onClick={() => setStatus(!status)} >
            <FaSearch className="h-4 w-4 text-gray-500 mx-2" />
          </button>


          {/* Orders */}
          <NavLink
            to="/orders"
            className="hidden lg:flex group flex-col text-sm gap-1 items-center text-gray-700 hover:text-gray-900"
          >
            <p>Orders</p>
            <hr className="w-2/4 h-[1.5px] bg-t group-hover:bg-gray-700 border-none" />
          </NavLink>

          {/* Cart */}
          <NavLink
            to="/cart"
            className="group hidden lg:block text-gray-700 hover:text-gray-900 relative"
          >
            <FaShoppingBag className="h-6 w-7" />
            <span className="absolute bg-gray-700 group-hover:bg-gray-900 text-white text-xs rounded-full top-[13px] -right-1 px-1">
              0
            </span>
          </NavLink>

          {/* Avatar Dropdown */}
          <NavLink
            to=""
            className="flex group flex-col items-center text-gray-700 hover:text-gray-900 relative"
          >
            <Avatar src="" sx={{ height: 28, width: 28 }} alt="User" />
            <div className="dropdown-content hidden group-hover:block absolute rounded-lg bg-white text-gray-700 shadow-lg border border-gray-300 top-8 right-0 p-4 z-50">
              <ul className="space-y-2">
                <li>
                  <NavLink to="/profile" className="hover:text-gray-900">
                    Profile
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/settings" className="hover:text-gray-900">
                    Settings
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/logout" className="hover:text-gray-900">
                    Logout
                  </NavLink>
                </li>
              </ul>
            </div>
          </NavLink>

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
