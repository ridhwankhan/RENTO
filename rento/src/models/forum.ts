import mongoose from 'mongoose';

const AuthorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    avatar: { type: String },
  },
  { _id: false }
);

const CommunityForumSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    preview: { type: String, required: true },
    category: { type: String, required: true },
    author: { type: AuthorSchema, required: true },
    comments: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    time: { type: String, required: true }, // You can change this to Date for a real timestamp
  },
  { timestamps: true }
);

export default mongoose.models.CommunityForum || mongoose.model('CommunityForum', CommunityForumSchema);
