import React from 'react';
import logo from "../assets/logoshopSutra.png";

function Footer() {
    return (
        <footer className="bg-white text-black py-10"  style={{ fontFamily: 'Poppins, sans-serif' }}>
            <div className=" mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-10  sm:text-left">
                {/* Logo and Description */}
                <div>
                    <img src={logo} alt="ShopSutra Logo" className="mx-auto sm:mx-0 mb-4 w-24 h-auto" />
                    <p className="text-[12px] text-gray-600">
                        ShopSutra is your trusted platform for hassle-free shopping experiences with quality service and care.
                    </p>
                </div>

                {/* Company Links */}
                <div>
                    <h2 className="text-lg font-semibold mb-4">Company</h2>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:text-blue-600 text-[12px] text-gray-600">About Us</a></li>
                        <li><a href="#" className="hover:text-blue-600 text-[12px] text-gray-600">Contact</a></li>
                        <li><a href="#" className="hover:text-blue-600 text-[12px] text-gray-600">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-blue-600 text-[12px] text-gray-600">Terms of Service</a></li>
                    </ul>
                </div>

                {/* Get in Touch */}
                <div>
                    <h2 className="text-lg font-semibold mb-4">Get in Touch</h2>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:text-blue-600 text-[12px] text-gray-600">Facebook</a></li>
                        <li><a href="#" className="hover:text-blue-600 text-[12px] text-gray-600">Twitter</a></li>
                        <li><a href="#" className="hover:text-blue-600 text-[12px] text-gray-600">Instagram</a></li>
                        <li><a href="#" className="hover:text-blue-600 text-[12px] text-gray-600">LinkedIn</a></li>
                        <li><a href="mailto:support@shopsutra.com" className="hover:text-blue-600 text-[12px] text-gray-600">support@shopsutra.com</a></li>
                        <li><a href="tel:+911234567890" className="hover:text-blue-600 text-[12px] text-gray-600">+91 12345 67890</a></li>
                    </ul>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="mt-10 border-t border-gray-200 pt-4 text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} ShopSutra. All rights reserved.
            </div>
        </footer>
    );
}

export default Footer;
