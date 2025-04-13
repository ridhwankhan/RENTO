import React from 'react';
import './Header.css';

const Header: React.FC = () => {
    return (
        <header className="fixed top-0 w-full bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <i className="fas fa-home text-2xl text-blue-600"></i>
            <span className="text-xl font-semibold">Rento</span>
          </div>

          <nav className="hidden md:flex space-x-8">
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 cursor-pointer"
            >
              Home
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 cursor-pointer"
            >
              Listings
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 cursor-pointer"
            >
              Blog
            </a>
            <a
              href="/blogs"
              className="text-gray-600 hover:text-blue-600 cursor-pointer"
            >
              About
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 cursor-pointer"
            >
              Contact
            </a>
          </nav>

          <button
            className="!rounded-button bg-blue-600 text-white px-6 py-2 hover:bg-blue-700 transition duration-300 cursor-pointer whitespace-nowrap"
          >
            Subscribe
          </button>
        </div>
      </header>
    );
};

export default Header;