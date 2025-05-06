"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, ThumbsUp, Eye, Filter, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ForumsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);

  const posts = [
    {
      id: 1,
      title: "Best areas for newcomers?",
      content: "I'm moving to the city next month. Which areas would you recommend for young professionals?",
      author: "Sarah K.",
      date: "2025-04-10",
      category: "housing",
      replies: 15,
      views: 234,
      likes: 45,
      isAnonymous: false,
      tags: ["newcomer", "housing", "advice"]
    },
    {
      id: 2,
      title: "Safety concerns in downtown",
      content: "Has anyone else noticed increased activity around the central station?",
      author: "Anonymous",
      date: "2025-04-09",
      category: "safety",
      replies: 23,
      views: 567,
      likes: 89,
      isAnonymous: true,
      tags: ["safety", "downtown", "alert"]
    },
    // Add more posts as needed
    {
      id: 3,
      title: "Looking for language exchange partners",
      content: "I'm learning Bengali and would love to practice with native speakers. Anyone interested in language exchange?",
      author: "John D.",
      date: "2025-04-08",
      category: "education",
      replies: 8,
      views: 120,
      likes: 32,
      isAnonymous: false,
      tags: ["language", "education", "community"]
    },
    {
      id: 4,
      title: "Best restaurants in the city center",
      content: "I'm looking for recommendations for authentic local cuisine in the city center. Any suggestions?",
      author: "Foodie123",
      date: "2025-04-07",
      category: "lifestyle",
      replies: 19,
      views: 345,
      likes: 67,
      isAnonymous: false,
      tags: ["food", "restaurants", "recommendations"]
    },
    {
      id: 5,
      title: "Public transportation tips",
      content: "What's the best way to navigate the city using public transportation? Are there any apps or passes I should know about?",
      author: "NewInTown",
      date: "2025-04-06",
      category: "lifestyle",
      replies: 12,
      views: 230,
      likes: 41,
      isAnonymous: false,
      tags: ["transportation", "city", "tips"]
    },
  ];

  useEffect(() => {
    // Filter posts based on search query and active category
    let filtered = [...posts];

    // Filter by category
    if (activeCategory !== "all") {
      filtered = filtered.filter(post => post.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.tags.some((tag: string) => tag.toLowerCase().includes(query))
      );
    }

    // Sort posts
    if (sortBy === "latest") {
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === "popular") {
      filtered.sort((a, b) => b.likes - a.likes);
    } else if (sortBy === "most_replies") {
      filtered.sort((a, b) => b.replies - a.replies);
    }

    setFilteredPosts(filtered);
  }, [searchQuery, activeCategory, sortBy, posts]);

  return (
    <div className="container py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Community Forums</h1>
          <p className="text-muted-foreground">Join the conversation</p>
        </div>
        <Button asChild>
          <Link href="/forums/create">Create Post</Link>
        </Button>
      </div>

      <div className="mb-8 flex flex-col gap-4 md:flex-row">
        <div className="relative md:max-w-xs w-full">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search discussions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="most_replies">Most Replies</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-8" value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList>
          <TabsTrigger value="all">All Topics</TabsTrigger>
          <TabsTrigger value="housing">Housing</TabsTrigger>
          <TabsTrigger value="safety">Safety</TabsTrigger>
          <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredPosts.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-lg font-medium">No posts found</p>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
          <Button className="mt-4" asChild>
            <Link href="/forums/create">Create a New Post</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="mb-2">
                    <Link href={`/forums/${post.id}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </CardTitle>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Boost Post
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{post.content}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Posted by {post.author}</span>
                <span>{post.date}</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>{post.replies} replies</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{post.views} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{post.likes} likes</span>
                </div>
              </div>
              <Button variant="ghost" asChild>
                <Link href={`/forums/${post.id}`}>Reply</Link>
              </Button>
            </CardFooter>
          </Card>
          ))}
        </div>
      )}
    </div>
  );
}