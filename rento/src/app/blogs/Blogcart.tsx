import React from "react";
import Image from "next/image";
import Link from "next/link";



const Blogcart = ({_id,image, title, category,excerpt,author,likes}) => {
  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300"
    >
      <div className="relative h-48">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <span className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
          {category}
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{excerpt}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src={author.avatar}
              alt={author.name}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm text-gray-700">{author.name}</span>
          </div>
          <button className="text-gray-400 hover:text-red-500 cursor-pointer">
            <i className="far fa-heart"></i>
            <span className="ml-1">{likes}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Blogcart;
