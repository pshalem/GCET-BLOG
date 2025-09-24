import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Heart, MessageCircle, Share2, ChevronUp, ChevronDown, 
  Pin, Clock, Tag, User
} from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ReactionButton } from './reaction-button';
import type { Post, Reaction } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: Post;
  showActions?: boolean;
  compact?: boolean;
}

export function PostCard({ post, showActions = true, compact = false }: PostCardProps) {
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(post.votes.userVote || null);
  const [votes, setVotes] = useState(post.votes);
  const [reactions, setReactions] = useState<Reaction[]>(post.reactions);

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
        newUserVote = null; // Remove vote
      } else {
        newUpvotes++;
      }
    } else {
      if (userVote === 'down') {
        newUserVote = null; // Remove vote
      } else {
        newDownvotes++;
      }
    }

    setUserVote(newUserVote);
    setVotes({ upvotes: newUpvotes, downvotes: newDownvotes, userVote: newUserVote });
  };

  const handleReaction = (type: Reaction['type']) => {
    // In a real app, this would make an API call
    console.log(`Reacted with ${type} to post ${post.id}`);
  };

  const truncateContent = (content: string, maxLength: number = 300) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    hover: { 
      y: -2,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-border/50">
        {post.isPinned && (
          <div className="bg-accent/10 border-b border-accent/20 px-4 py-2">
            <div className="flex items-center text-sm text-accent-foreground">
              <Pin className="w-4 h-4 mr-2" />
              Pinned Post
            </div>
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback>
                  {post.author.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-semibold text-foreground">{post.author.name}</h4>
                  <Badge variant={post.author.role === 'staff' ? 'default' : 'secondary'} className="text-xs">
                    {post.author.role}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{post.author.department}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(post.createdAt, { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
            
            {showActions && (
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleVote('up')}
                  className={`hover:bg-accent/20 ${
                    userVote === 'up' ? 'text-accent bg-accent/10' : 'text-muted-foreground'
                  }`}
                >
                  <ChevronUp className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium min-w-[2rem] text-center">
                  {votes.upvotes - votes.downvotes}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleVote('down')}
                  className={`hover:bg-destructive/20 ${
                    userVote === 'down' ? 'text-destructive bg-destructive/10' : 'text-muted-foreground'
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2 mt-4">
            <Link to={`/post/${post.id}`} className="block">
              <h3 className="text-lg font-bold text-foreground hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h3>
            </Link>
            
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                <Tag className="w-3 h-3 mr-1" />
                {post.category.name}
              </Badge>
              {post.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{post.tags.length - 3} more
                </span>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-4">
          <div className="prose prose-sm max-w-none text-foreground">
            <p className="whitespace-pre-wrap leading-relaxed">
              {compact ? truncateContent(post.content) : post.content}
            </p>
            {compact && post.content.length > 300 && (
              <Link 
                to={`/post/${post.id}`}
                className="text-primary hover:underline text-sm font-medium mt-2 inline-block"
              >
                Read more
              </Link>
            )}
          </div>
        </CardContent>

        {showActions && (
          <CardFooter className="pt-0 pb-4">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-4">
                {/* Reaction Buttons */}
                <div className="flex items-center space-x-1">
                  <ReactionButton type="clap" onReact={handleReaction} />
                  <ReactionButton type="like" onReact={handleReaction} />
                  <ReactionButton type="celebrate" onReact={handleReaction} />
                  <ReactionButton type="fire" onReact={handleReaction} />
                </div>
                
                {/* Reaction Count */}
                {reactions.length > 0 && (
                  <span className="text-sm text-muted-foreground">
                    {reactions.length} reaction{reactions.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" className="hover:bg-secondary">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  {post.comments.length} comment{post.comments.length !== 1 ? 's' : ''}
                </Button>
                
                <Button variant="ghost" size="sm" className="hover:bg-secondary">
                  <Share2 className="w-4 h-4 mr-1" />
                  Share
                </Button>
              </div>
            </div>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
}