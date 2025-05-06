'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThumbsUp, MessageSquare, Flag, ArrowLeft, Send } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

// Mock post data
const post = {
  id: 1,
  title: 'Best areas for newcomers?',
  content: "I'm moving to the city next month for a new job. Which areas would you recommend for young professionals? I'm looking for a safe neighborhood with good public transportation and affordable rent. Ideally, I'd like to be close to restaurants and parks. Any advice would be greatly appreciated!",
  author: 'Sarah K.',
  authorImage: 'https://randomuser.me/api/portraits/women/44.jpg',
  date: '2025-04-10',
  category: 'housing',
  replies: 3,
  views: 234,
  likes: 45,
  isAnonymous: false,
  tags: ['newcomer', 'housing', 'advice'],
};

// Mock comments data
const initialComments = [
  {
    id: 1,
    author: 'Michael Chen',
    authorImage: 'https://randomuser.me/api/portraits/men/22.jpg',
    content: 'I would recommend the Riverside district. It\'s safe and has great public transport connections. There are plenty of restaurants and a beautiful park along the river. Rent is reasonable compared to downtown.',
    date: '2025-04-10',
    likes: 12,
    isAnonymous: false,
  },
  {
    id: 2,
    author: 'Anonymous',
    authorImage: '',
    content: 'Downtown is great if you want to be close to everything, but it might be a bit above your budget. The University District is more affordable and has a young crowd.',
    date: '2025-04-11',
    likes: 8,
    isAnonymous: true,
  },
  {
    id: 3,
    author: 'Emily Johnson',
    authorImage: 'https://randomuser.me/api/portraits/women/33.jpg',
    content: 'I moved here last year and chose the Arts District. It\'s a bit more expensive but has amazing restaurants and a great community feel. Public transport is decent too.',
    date: '2025-04-12',
    likes: 5,
    isAnonymous: false,
  },
];

export default function PostDetailPage({ params }: { params: { id: string } }) {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [postLikes, setPostLikes] = useState(post.likes);
  const [commentLikes, setCommentLikes] = useState<Record<number, number>>(
    initialComments.reduce((acc, comment) => ({ ...acc, [comment.id]: comment.likes }), {})
  );
  const { toast } = useToast();

  const handleLikePost = () => {
    setPostLikes(postLikes + 1);
    toast({
      title: 'Post liked',
      description: 'You liked this post',
    });
  };

  const handleLikeComment = (commentId: number) => {
    setCommentLikes({
      ...commentLikes,
      [commentId]: (commentLikes[commentId] || 0) + 1,
    });
    toast({
      title: 'Comment liked',
      description: 'You liked this comment',
    });
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newCommentObj = {
      id: comments.length + 1,
      author: isAnonymous ? 'Anonymous' : 'Current User',
      authorImage: isAnonymous ? '' : 'https://randomuser.me/api/portraits/men/32.jpg',
      content: newComment,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      isAnonymous,
    };

    setComments([...comments, newCommentObj]);
    setNewComment('');
    setIsAnonymous(false);
    
    toast({
      title: 'Reply posted',
      description: 'Your reply has been posted successfully',
    });
  };

  return (
    <div className="container py-8">
      <Link href="/forums" className="mb-4 flex items-center text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to forums
      </Link>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="mb-2 text-2xl">{post.title}</CardTitle>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <Badge variant="outline" className="capitalize">
              {post.category}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <p className="mb-4 whitespace-pre-line">{post.content}</p>
          </div>
          <div className="flex items-center gap-4">
            <Avatar>
              {post.isAnonymous ? (
                <AvatarFallback>A</AvatarFallback>
              ) : (
                <>
                  <AvatarImage src={post.authorImage} alt={post.author} />
                  <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                </>
              )}
            </Avatar>
            <div>
              <p className="font-medium">{post.author}</p>
              <p className="text-sm text-muted-foreground">Posted on {post.date}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t px-6 py-4">
          <div className="flex gap-6">
            <Button variant="ghost" size="sm" onClick={handleLikePost} className="gap-2">
              <ThumbsUp className="h-4 w-4" />
              <span>{postLikes} likes</span>
            </Button>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              <span>{comments.length} replies</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="gap-2">
            <Flag className="h-4 w-4" />
            <span>Report</span>
          </Button>
        </CardFooter>
      </Card>

      <div className="mb-8">
        <h2 className="mb-4 text-xl font-bold">Replies</h2>
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="pt-6">
                <div className="mb-4">
                  <p className="mb-4">{comment.content}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      {comment.isAnonymous ? (
                        <AvatarFallback>A</AvatarFallback>
                      ) : (
                        <>
                          <AvatarImage src={comment.authorImage} alt={comment.author} />
                          <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                        </>
                      )}
                    </Avatar>
                    <div>
                      <p className="font-medium">{comment.author}</p>
                      <p className="text-sm text-muted-foreground">Replied on {comment.date}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLikeComment(comment.id)}
                    className="gap-2"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>{commentLikes[comment.id] || 0}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-bold">Leave a reply</h2>
        <form onSubmit={handleSubmitComment}>
          <Textarea
            placeholder="Write your reply here..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="mb-4 min-h-32"
          />
          <div className="mb-4 flex items-center space-x-2">
            <Checkbox
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={(checked) => setIsAnonymous(checked === true)}
            />
            <Label htmlFor="anonymous">Post anonymously</Label>
          </div>
          <Button type="submit" className="gap-2">
            <Send className="h-4 w-4" />
            Post Reply
          </Button>
        </form>
      </div>
    </div>
  );
}
