import connectToDatabase from "@/lib/dbConnect";
import Blog from "@/models/blog";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  await connectToDatabase();

  const {id} = await context.params;

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
