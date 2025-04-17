// models/CommunityForum.js
const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  avatar: { type: String },
}, { _id: false });

const communityForumSchema = new mongoose.Schema({
  title: { type: String, required: true },
  preview: { type: String, required: true },
  category: { type: String, required: true },
  author: { type: authorSchema, required: true },
  comments: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  time: { type: String, required: true }, // You can change this to Date for a real timestamp
}, { timestamps: true });

module.exports = mongoose.models.CommunityForum || mongoose.model('CommunityForum', communityForumSchema);
