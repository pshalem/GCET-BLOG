import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Edit, MapPin, Calendar, Award, MessageSquare, 
  ThumbsUp, BookOpen, Users, Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PostCard } from '@/components/ui/post-card';
import { useAppStore } from '@/store';
import { mockUsers } from '@/utils/mockData';
import type { User } from '@/types';
import { formatDistanceToNow } from 'date-fns';

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const { currentUser, posts } = useAppStore();
  const [user, setUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState(posts.filter(p => p.author.id === (id || currentUser?.id)));

  useEffect(() => {
    if (id) {
      const foundUser = mockUsers.find(u => u.id === id);
      setUser(foundUser || null);
      setUserPosts(posts.filter(p => p.author.id === id));
    } else {
      setUser(currentUser);
      setUserPosts(posts.filter(p => p.author.id === currentUser?.id));
    }
  }, [id, currentUser, posts]);

  if (!user) {
    return <div>User not found</div>;
  }

  const isOwnProfile = user.id === currentUser?.id;

  const achievements = [
    { name: 'First Post', description: 'Created your first post', earned: true },
    { name: 'Helpful Member', description: 'Received 50+ upvotes', earned: user.stats.upvotes >= 50 },
    { name: 'Active Contributor', description: 'Posted 20+ times', earned: user.stats.posts >= 20 },
    { name: 'Community Leader', description: 'Reached 1000+ reputation', earned: user.stats.reputation >= 1000 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-6"
    >
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-2xl">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
                  <Badge variant={user.role === 'staff' ? 'default' : 'secondary'}>
                    {user.role}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-4 mt-2 text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{user.department}</span>
                  </div>
                  {user.year && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Year {user.year}</span>
                    </div>
                  )}
                </div>
                
                {user.bio && (
                  <p className="text-foreground mt-3">{user.bio}</p>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                {user.badges.map((badge) => (
                  <Badge key={badge.id} variant="outline" className="text-xs">
                    <span className="mr-1">{badge.icon}</span>
                    {badge.name}
                  </Badge>
                ))}
              </div>
            </div>
            
            {isOwnProfile && (
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="pt-6">
            <BookOpen className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold text-foreground">{user.stats.posts}</div>
            <p className="text-sm text-muted-foreground">Posts</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-6">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-accent" />
            <div className="text-2xl font-bold text-foreground">{user.stats.comments}</div>
            <p className="text-sm text-muted-foreground">Comments</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-6">
            <ThumbsUp className="w-8 h-8 mx-auto mb-2 text-success" />
            <div className="text-2xl font-bold text-foreground">{user.stats.upvotes}</div>
            <p className="text-sm text-muted-foreground">Upvotes</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-6">
            <Award className="w-8 h-8 mx-auto mb-2 text-warning" />
            <div className="text-2xl font-bold text-foreground">{user.stats.reputation}</div>
            <p className="text-sm text-muted-foreground">Reputation</p>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="posts" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="posts">Posts ({userPosts.length})</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts" className="space-y-6">
          {userPosts.length > 0 ? (
            userPosts.map((post) => (
              <PostCard key={post.id} post={post} compact />
            ))
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2 text-foreground">No posts yet</h3>
                <p className="text-muted-foreground">
                  {isOwnProfile ? "You haven't created any posts yet." : `${user.name} hasn't posted anything yet.`}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.name} className={achievement.earned ? 'border-primary/50' : 'opacity-60'}>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      achievement.earned ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                    }`}>
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className={`font-medium ${achievement.earned ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {achievement.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-muted-foreground">
                    Posted "Understanding Machine Learning Algorithms" 
                    <span className="text-foreground ml-1">2 days ago</span>
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-muted-foreground">
                    Commented on a discussion 
                    <span className="text-foreground ml-1">3 days ago</span>
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-muted-foreground">
                    Earned "Helper" badge 
                    <span className="text-foreground ml-1">1 week ago</span>
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}