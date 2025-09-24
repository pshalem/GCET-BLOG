import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, MessageCircle, Share2, Flag, Edit,
  ChevronUp, ChevronDown, Reply, MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { ReactionButton } from '@/components/ui/reaction-button';
import { useAppStore } from '@/store';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import type { Post, Comment, Reaction } from '@/types';

interface CommentProps {
  comment: Comment;
  depth?: number;
  onReply?: (commentId: string, content: string) => void;
}

function CommentComponent({ comment, depth = 0, onReply }: CommentProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(comment.votes.userVote || null);
  const [votes, setVotes] = useState(comment.votes);

  const handleVote = (type: 'up' | 'down') => {
    let newUpvotes = votes.upvotes;
    let newDownvotes = votes.downvotes;
    let newUserVote: 'up' | 'down' | null = type;

    // Remove previous vote
    if (userVote === 'up') newUpvotes--;
    if (userVote === 'down') newDownvotes--;

    // Apply new vote
    if (type === 'up') {
      if (userVote === 'up') {
        newUserVote = null;
      } else {
        newUpvotes++;
      }
    } else {
      if (userVote === 'down') {
        newUserVote = null;
      } else {
        newDownvotes++;
      }
    }

    setUserVote(newUserVote);
    setVotes({ upvotes: newUpvotes, downvotes: newDownvotes, userVote: newUserVote });
  };

  const handleReply = () => {
    if (replyContent.trim() && onReply) {
      onReply(comment.id, replyContent);
      setReplyContent('');
      setShowReplyForm(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`${depth > 0 ? 'ml-8 border-l-2 border-border pl-4' : ''} space-y-4`}
    >
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                <AvatarFallback>
                  {comment.author.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-foreground">{comment.author.name}</h4>
                  <Badge variant={comment.author.role === 'staff' ? 'default' : 'secondary'} className="text-xs">
                    {comment.author.role}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleVote('up')}
                className={`w-6 h-6 ${
                  userVote === 'up' ? 'text-accent bg-accent/10' : 'text-muted-foreground'
                }`}
              >
                <ChevronUp className="w-3 h-3" />
              </Button>
              <span className="text-xs font-medium min-w-[1.5rem] text-center">
                {votes.upvotes - votes.downvotes}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleVote('down')}
                className={`w-6 h-6 ${
                  userVote === 'down' ? 'text-destructive bg-destructive/10' : 'text-muted-foreground'
                }`}
              >
                <ChevronDown className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <p className="text-foreground whitespace-pre-wrap leading-relaxed">
            {comment.content}
          </p>
          
          <div className="flex items-center space-x-4 mt-3 pt-3 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-xs hover:bg-secondary"
            >
              <Reply className="w-3 h-3 mr-1" />
              Reply
            </Button>
            <Button variant="ghost" size="sm" className="text-xs hover:bg-secondary">
              <Flag className="w-3 h-3 mr-1" />
              Report
            </Button>
          </div>

          {/* Reply Form */}
          {showReplyForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 space-y-3"
            >
              <Textarea
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-[80px]"
              />
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowReplyForm(false)}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm"
                  onClick={handleReply}
                  disabled={!replyContent.trim()}
                >
                  Reply
                </Button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-4">
          {comment.replies.map((reply) => (
            <CommentComponent
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const { posts, currentUser } = useAppStore();
  const [post, setPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState('');
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [votes, setVotes] = useState({ upvotes: 0, downvotes: 0 });
  const [reactions, setReactions] = useState<Reaction[]>([]);

  useEffect(() => {
    const foundPost = posts.find(p => p.id === id);
    if (foundPost) {
      setPost(foundPost);
      setUserVote(foundPost.votes.userVote || null);
      setVotes(foundPost.votes);
      setReactions(foundPost.reactions);
    }
  }, [id, posts]);

  if (!post) {
    return <Navigate to="/" replace />;
  }

  const handleVote = (type: 'up' | 'down') => {
    let newUpvotes = votes.upvotes;
    let newDownvotes = votes.downvotes;
    let newUserVote: 'up' | 'down' | null = type;

    if (userVote === 'up') newUpvotes--;
    if (userVote === 'down') newDownvotes--;

    if (type === 'up') {
      if (userVote === 'up') {
        newUserVote = null;
      } else {
        newUpvotes++;
      }
    } else {
      if (userVote === 'down') {
        newUserVote = null;
      } else {
        newDownvotes++;
      }
    }

    setUserVote(newUserVote);
    setVotes({ upvotes: newUpvotes, downvotes: newDownvotes });
  };

  const handleReaction = (type: Reaction['type']) => {
    console.log(`Reacted with ${type} to post ${post.id}`);
  };

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      console.log('Adding comment:', newComment);
      setNewComment('');
    }
  };

  const handleReply = (commentId: string, content: string) => {
    console.log('Replying to comment:', commentId, content);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Back Button */}
      <Link to="/">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </Link>

      {/* Post Content */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback>
                  {post.author.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-semibold text-foreground">{post.author.name}</h4>
                  <Badge variant={post.author.role === 'staff' ? 'default' : 'secondary'}>
                    {post.author.role}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{post.author.department}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(post.createdAt, { addSuffix: true })}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleVote('up')}
                className={`${
                  userVote === 'up' ? 'text-accent bg-accent/10' : 'text-muted-foreground'
                }`}
              >
                <ChevronUp className="w-5 h-5" />
              </Button>
              <span className="text-lg font-bold min-w-[3rem] text-center">
                {votes.upvotes - votes.downvotes}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleVote('down')}
                className={`${
                  userVote === 'down' ? 'text-destructive bg-destructive/10' : 'text-muted-foreground'
                }`}
              >
                <ChevronDown className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="space-y-4 mt-4">
            <h1 className="text-2xl font-bold text-foreground">{post.title}</h1>
            
            <div className="flex items-center space-x-2 flex-wrap">
              <Badge variant="outline">
                {post.category.name}
              </Badge>
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="prose prose-lg max-w-none text-foreground">
            <p className="whitespace-pre-wrap leading-relaxed">{post.content}</p>
          </div>

          {/* Reactions and Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <ReactionButton type="clap" onReact={handleReaction} />
                <ReactionButton type="like" onReact={handleReaction} />
                <ReactionButton type="celebrate" onReact={handleReaction} />
                <ReactionButton type="fire" onReact={handleReaction} />
              </div>
              
              {reactions.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  {reactions.length} reaction{reactions.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
              <Button variant="ghost" size="sm">
                <Flag className="w-4 h-4 mr-1" />
                Report
              </Button>
              {currentUser?.id === post.author.id && (
                <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              Comments ({post.comments.length})
            </h3>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Add Comment Form */}
          {currentUser && (
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback>
                    {currentUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-foreground">{currentUser.name}</span>
              </div>
              <Textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex justify-end">
                <Button 
                  onClick={handleCommentSubmit}
                  disabled={!newComment.trim()}
                >
                  Post Comment
                </Button>
              </div>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {post.comments.map((comment) => (
              <CommentComponent
                key={comment.id}
                comment={comment}
                onReply={handleReply}
              />
            ))}
          </div>

          {post.comments.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No comments yet. Be the first to comment!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}