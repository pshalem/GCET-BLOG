import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Filter, TrendingUp, Users, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PostCard } from '@/components/ui/post-card';
import { useAppStore } from '@/store';
import { Link } from 'react-router-dom';
import type { Post } from '@/types';

const quickStats = [
  { title: 'Total Posts', value: '1,234', icon: BookOpen, color: 'text-primary' },
  { title: 'Active Users', value: '456', icon: Users, color: 'text-accent' },
  { title: 'This Week', value: '+89', icon: TrendingUp, color: 'text-success' },
];

const filterOptions = [
  { label: 'All Posts', value: 'all' },
  { label: 'Academic', value: 'academic' },
  { label: 'Projects', value: 'projects' },
  { label: 'Events', value: 'events' },
  { label: 'Career', value: 'career' },
];

export default function Home() {
  const { posts, currentUser } = useAppStore();
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let filtered = posts;

    // Apply category filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(post => 
        post.category.name.toLowerCase() === selectedFilter
      );
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort by creation date (newest first) and pin status
    filtered = filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    setFilteredPosts(filtered);
  }, [posts, selectedFilter, searchQuery]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {currentUser?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Stay connected with your GCET community
          </p>
        </div>
        <Link to="/create">
          <Button size="lg" className="shadow-primary">
            <Plus className="w-4 h-4 mr-2" />
            Create Post
          </Button>
        </Link>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickStats.map((stat, index) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Search and Filters */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search posts, topics, or users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-secondary/50"
          />
        </div>
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {filterOptions.map((option) => (
            <Badge
              key={option.value}
              variant={selectedFilter === option.value ? 'default' : 'secondary'}
              className="cursor-pointer whitespace-nowrap hover:bg-primary/80 transition-colors"
              onClick={() => setSelectedFilter(option.value)}
            >
              <Filter className="w-3 h-3 mr-1" />
              {option.label}
            </Badge>
          ))}
        </div>
      </motion.div>

      {/* Posts Feed */}
      <motion.div variants={itemVariants} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            Latest Posts
            {selectedFilter !== 'all' && (
              <span className="text-primary ml-2">
                · {filterOptions.find(f => f.value === selectedFilter)?.label}
              </span>
            )}
          </h2>
          <span className="text-sm text-muted-foreground">
            {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Posts List */}
        <div className="space-y-6">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                variants={itemVariants}
                transition={{ delay: index * 0.1 }}
              >
                <PostCard post={post} compact />
              </motion.div>
            ))
          ) : (
            <motion.div variants={itemVariants}>
              <Card className="text-center py-12">
                <CardContent>
                  <div className="text-muted-foreground">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No posts found</h3>
                    <p className="mb-4">
                      {searchQuery 
                        ? `No posts match "${searchQuery}"`
                        : 'No posts in this category yet'
                      }
                    </p>
                    <Link to="/create">
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Create the first post
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Load More (Placeholder for pagination) */}
      {filteredPosts.length > 5 && (
        <motion.div variants={itemVariants} className="text-center">
          <Button variant="outline" size="lg">
            Load More Posts
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}