"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface BlogDetail {
  _id: string;
  image: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  readTime: string;
  likes: number;
}

const BlogDetailPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState<BlogDetail | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        if (!id || typeof id !== "string") {
          console.log("Invalid blog ID:", id);
          throw new Error("Invalid blog ID");
        }

        const response = await fetch(`/api/blog/${id}`);
        console.log("API response:", response);

        if (!response.ok) {
          throw new Error("Blog not found");
        }

        const data = await response.json();
        console.log("Blog data fetched:", data);
        setBlog(data);
      } catch (error) {
        console.error("Error fetching blog data:", error);
      }
    };

    fetchBlog();
  }, [id]);

  if (!blog) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-600">Loading blog post...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="mb-6 text-sm text-gray-500">{blog.category}</div>
      <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
      <div className="flex items-center gap-4 mb-8">
        <img
          src={blog.author.avatar}
          alt={blog.author.name}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="font-medium text-gray-800">{blog.author.name}</p>
          <p className="text-sm text-gray-500">
            {new Date(blog.date).toLocaleDateString()} • {blog.readTime}
          </p>
        </div>
      </div>
      <img
        src={blog.image}
        alt={blog.title}
        className="w-full h-[400px] object-cover rounded-lg mb-8"
      />
      <div className="prose prose-lg max-w-none text-gray-800">
        <p>{blog.excerpt}</p>
        <hr className="my-6" />
        <p>{blog.content || "Full blog content goes here..."}</p>
      </div>
      <div className="mt-10 text-sm text-gray-500">
        {blog.likes} likes • Category: {blog.category}
      </div>
    </div>
  );
};

export default BlogDetailPage;
