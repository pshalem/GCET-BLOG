import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, Medal, Award, Crown, Star, TrendingUp,
  Users, MessageSquare, ThumbsUp, BookOpen
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { mockUsers } from '@/utils/mockData';
import type { User } from '@/types';

const leaderboardCategories = [
  { id: 'reputation', name: 'Reputation', icon: Crown, color: 'text-warning' },
  { id: 'posts', name: 'Posts', icon: BookOpen, color: 'text-primary' },
  { id: 'comments', name: 'Comments', icon: MessageSquare, color: 'text-accent' },
  { id: 'upvotes', name: 'Upvotes Received', icon: ThumbsUp, color: 'text-success' }
];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return { icon: Crown, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' };
    case 2:
      return { icon: Medal, color: 'text-gray-400', bg: 'bg-gray-50 dark:bg-gray-900/20' };
    case 3:
      return { icon: Award, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' };
    default:
      return { icon: Star, color: 'text-muted-foreground', bg: 'bg-muted/20' };
  }
};

export default function Leaderboard() {
  const [selectedCategory, setSelectedCategory] = useState('reputation');
  
  const sortedUsers = [...mockUsers].sort((a, b) => {
    const key = selectedCategory as keyof User['stats'];
    return b.stats[key] - a.stats[key];
  });

  const topUsers = sortedUsers.slice(0, 3);
  const otherUsers = sortedUsers.slice(3);

  const currentCategory = leaderboardCategories.find(c => c.id === selectedCategory);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground flex items-center justify-center">
          <Trophy className="w-8 h-8 mr-3 text-warning" />
          Community Leaderboard
        </h1>
        <p className="text-muted-foreground">
          Celebrating our most active and helpful community members
        </p>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          {leaderboardCategories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="flex items-center space-x-2">
              <category.icon className={`w-4 h-4 ${category.color}`} />
              <span>{category.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {topUsers.map((user, index) => {
            const rank = index + 1;
            const { icon: RankIcon, color, bg } = getRankIcon(rank);
            const value = user.stats[selectedCategory as keyof User['stats']];

            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`relative overflow-hidden ${rank === 1 ? 'ring-2 ring-warning/50' : ''}`}>
                  <div className={`absolute top-0 right-0 ${bg} p-2 rounded-bl-lg`}>
                    <RankIcon className={`w-5 h-5 ${color}`} />
                  </div>
                  
                  <CardContent className="pt-8 text-center">
                    <div className="relative mb-4">
                      <Avatar className={`w-20 h-20 mx-auto ${rank === 1 ? 'ring-4 ring-warning/30' : ''}`}>
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="text-lg">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {rank === 1 && (
                        <div className="absolute -top-2 -right-2 bg-warning text-warning-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                          1
                        </div>
                      )}
                    </div>
                    
                    <h3 className="font-bold text-lg text-foreground">{user.name}</h3>
                    <Badge variant={user.role === 'staff' ? 'default' : 'secondary'} className="mb-2">
                      {user.role}
                    </Badge>
                    <p className="text-sm text-muted-foreground mb-3">{user.department}</p>
                    
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${currentCategory?.color}`}>
                        {typeof value === 'number' ? value.toLocaleString() : value}
                      </div>
                      <p className="text-sm text-muted-foreground capitalize">
                        {selectedCategory}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Full Rankings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Full Rankings - {currentCategory?.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedUsers.map((user, index) => {
                const rank = index + 1;
                const { icon: RankIcon, color } = getRankIcon(rank);
                const value = user.stats[selectedCategory as keyof User['stats']];
                
                return (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center space-x-4 p-4 rounded-lg transition-colors ${
                      rank <= 3 ? 'bg-muted/20' : 'hover:bg-muted/10'
                    }`}
                  >
                    <div className="flex items-center justify-center w-12 h-12 text-2xl font-bold">
                      {rank <= 3 ? (
                        <RankIcon className={`w-6 h-6 ${color}`} />
                      ) : (
                        <span className="text-muted-foreground">#{rank}</span>
                      )}
                    </div>
                    
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-foreground truncate">{user.name}</h3>
                        <Badge variant={user.role === 'staff' ? 'default' : 'secondary'} className="text-xs">
                          {user.role}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{user.department}</p>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-xl font-bold ${currentCategory?.color}`}>
                        {typeof value === 'number' ? value.toLocaleString() : value}
                      </div>
                      <p className="text-xs text-muted-foreground capitalize">
                        {selectedCategory}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Achievement Spotlight */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="w-5 h-5 mr-2" />
              This Month's Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <Crown className="w-8 h-8 mx-auto mb-2 text-warning" />
                <h3 className="font-medium">Top Contributor</h3>
                <p className="text-sm text-muted-foreground">{topUsers[0]?.name}</p>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-medium">Most Helpful</h3>
                <p className="text-sm text-muted-foreground">
                  {sortedUsers.sort((a, b) => b.stats.comments - a.stats.comments)[0]?.name}
                </p>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-success" />
                <h3 className="font-medium">Rising Star</h3>
                <p className="text-sm text-muted-foreground">
                  {mockUsers.find(u => u.badges.some(b => b.name === 'Rising Star'))?.name || 'TBD'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Tabs>
    </motion.div>
  );
}