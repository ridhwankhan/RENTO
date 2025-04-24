import connectToDatabase from "@/lib/dbConnect";
import Blog from "@/models/blog";
import mongoose from "mongoose";
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  await connectToDatabase();

  const { id } = context.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return new Response("Invalid blog ID format", { status: 400 });
  }

  try {
    const blog = await Blog.findById(id);

    if (!blog) {
      console.log("Blog fetched:", blog);
      return new Response("Blog not found", { status: 404 });
    }

    return new Response(JSON.stringify(blog), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching blog data:", error);
    return new Response("Server Error", { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  context: { params: { id: string } }
) {
  await connectToDatabase();

  const { id } = context.params;
  console.log("PATCH request for ID:", id);

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    console.error("Invalid blog ID format");
    return new Response("Invalid blog ID format", { status: 400 });
  }

  try {
    const { increment } = await request.json();
    console.log("Increment value received:", increment);

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { $inc: { likes: increment } },
      { new: true }
    );

    if (!updatedBlog) {
      console.error("Blog not found");
      return new Response("Blog not found", { status: 404 });
    }

    console.log("Updated blog:", updatedBlog);

    return new Response(JSON.stringify(updatedBlog), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating blog:", error); // Log exact error
    return new Response("Failed to update blog", { status: 500 });
  }
}


