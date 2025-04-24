import React from "react";
import Image from "next/image";
import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";

const isLoggedIn = true; // Replace with actual authentication logic
const showLoginPopup = () => alert("Please log in to like the post.");

const Blogcart = ({ _id, image, title, category, excerpt, author, likes }) => {
  const [initialLikes, setinitialLikes] = useState<number>(likes);
  const [notLiked, setNotLiked] = useState<boolean>(true);

  useEffect(() => {
    console.log(`initialLikes updated: ${initialLikes}`);
  }, [initialLikes]);

  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300"
    >
      <div className="relative h-48">
        <Link href={`/blogs/${_id}`} className="absolute inset-0">
            <Image src={image} alt="" className="w-full h-full object-cover" width={500} height={300}></Image>
        </Link>
        <span className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
          {category}
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <Link href={`/blogs/${_id}`} className="text-blue-500 hover:underline">
          <p className="text-gray-600 text-sm mb-4">{excerpt}</p>
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src={author.avatar}
              alt={author.name}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm text-gray-700">{author.name}</span>
          </div>
            <button
            className={`cursor-pointer ${
              notLiked ? "text-gray-400 hover:text-red-500" : "text-red-500"
            }`}
            onClick={async () => {
              if (isLoggedIn && notLiked) {
              setinitialLikes((previnitialLikes) => previnitialLikes + 1);
              setNotLiked(false);
              try {
                const response = await fetch(`/api/blog/${_id}`, {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ increment: 1 }),
                });
                if (!response.ok) {
                throw new Error("Failed to update likes in the database.");
                }
              } catch (error) {
                console.error("Error updating likes:", error);
                // Revert state changes if the database update fails
                setinitialLikes((previnitialLikes) => previnitialLikes - 1);
                setNotLiked(true);
              }
              } else if (isLoggedIn && !notLiked) {
              setinitialLikes((previnitialLikes) => previnitialLikes - 1);
              setNotLiked(true);
              try {
                const response = await fetch(`/api/blog/${_id}`, {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                
                body: JSON.stringify({ increment: -1 }),
                });
                if (!response.ok) {
                throw new Error("Failed to update likes in the database.");
                }
              } catch (error) {
                console.error("Error updating likes:", error);
                // Revert state changes if the database update fails
                setinitialLikes((previnitialLikes) => previnitialLikes + 1);
                setNotLiked(false);
              }
              } else {
              showLoginPopup();
              }
            }}
            >
            <FontAwesomeIcon icon={faHeart} />
            <span className="ml-1">{initialLikes}</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default Blogcart;
