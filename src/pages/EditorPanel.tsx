import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, MessageSquare, CheckCircle, XCircle, Eye,
  Edit, Clock, Filter, Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useAppStore } from '@/store';
import { formatDistanceToNow } from 'date-fns';
import { toast } from '@/hooks/use-toast';

export default function EditorPanel() {
  const { currentUser, pendingPosts, approvePost, rejectPost, updatePost } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  // Redirect if not editor or admin
  if (!currentUser || !['editor', 'admin'].includes(currentUser.role)) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">Access Denied</h3>
            <p className="text-muted-foreground">
              You don't have permission to access the editor panel.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredPosts = pendingPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = (postId: string) => {
    approvePost(postId);
    toast({
      title: "Post approved",
      description: "The post has been published to the feed.",
    });
  };

  const handleReject = (postId: string) => {
    rejectPost(postId, rejectReason);
    setRejectReason('');
    toast({
      title: "Post rejected",
      description: "The author has been notified.",
      variant: "destructive"
    });
  };

  const handleEditAndApprove = (postId: string) => {
    updatePost(postId, { content: editContent });
    approvePost(postId);
    setEditContent('');
    setSelectedPost(null);
    toast({
      title: "Post edited and approved",
      description: "Your changes have been saved and the post is now live.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center">
            <Edit className="w-8 h-8 mr-3 text-primary" />
            Editor Panel
          </h1>
          <p className="text-muted-foreground mt-1">
            Review and approve student posts
          </p>
        </div>
        <Badge variant="default" className="text-sm">
          Editor Access
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Review
            </CardTitle>
            <Clock className="w-4 h-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{pendingPosts.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Approved Today
            </CardTitle>
            <CheckCircle className="w-4 h-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">12</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rejected Today
            </CardTitle>
            <XCircle className="w-4 h-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">3</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Post Queue</CardTitle>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search posts, authors, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPosts.length > 0 ? (
            <div className="space-y-6">
              {filteredPosts.map((post) => (
                <div key={post.id} className="border rounded-lg p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={post.author.avatar} alt={post.author.name} />
                        <AvatarFallback>
                          {post.author.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-foreground text-lg">{post.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          by {post.author.name} • {formatDistanceToNow(post.createdAt, { addSuffix: true })}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary">{post.category.name}</Badge>
                          {post.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-warning/10 text-warning border-warning">
                      Pending Review
                    </Badge>
                  </div>
                  
                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {post.content}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleApprove(post.id)}
                        className="bg-success hover:bg-success/90"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="destructive"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Reject Post</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                              Please provide a reason for rejecting this post:
                            </p>
                            <Textarea
                              placeholder="Enter rejection reason..."
                              value={rejectReason}
                              onChange={(e) => setRejectReason(e.target.value)}
                            />
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" onClick={() => setRejectReason('')}>
                                Cancel
                              </Button>
                              <Button 
                                variant="destructive" 
                                onClick={() => handleReject(post.id)}
                                disabled={!rejectReason.trim()}
                              >
                                Reject Post
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Dialog open={selectedPost === post.id} onOpenChange={(open) => {
                        if (!open) {
                          setSelectedPost(null);
                          setEditContent('');
                        }
                      }}>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedPost(post.id);
                              setEditContent(post.content);
                            }}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit & Approve
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Edit Post Content</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium text-foreground">Post Title</label>
                              <p className="text-lg font-medium mt-1">{post.title}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-foreground">Content</label>
                              <Textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="min-h-[300px] mt-2"
                                placeholder="Edit post content..."
                              />
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button 
                                variant="outline" 
                                onClick={() => {
                                  setSelectedPost(null);
                                  setEditContent('');
                                }}
                              >
                                Cancel
                              </Button>
                              <Button 
                                onClick={() => handleEditAndApprove(post.id)}
                                className="bg-success hover:bg-success/90"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Save & Approve
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    
                    <Button size="sm" variant="ghost">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">No posts to review</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'No posts match your search criteria.' : 'All posts have been reviewed.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}