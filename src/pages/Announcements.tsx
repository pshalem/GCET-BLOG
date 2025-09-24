import { motion } from 'framer-motion';
import { 
  Calendar, Pin, AlertCircle, Info, CheckCircle, 
  Clock, User, Filter, Search, Plus
} from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { mockAnnouncements } from '@/utils/mockData';
import { formatDistanceToNow } from 'date-fns';
import { useAppStore } from '@/store';
import type { Announcement } from '@/types';

const priorityConfig = {
  urgent: { 
    color: 'destructive' as const, 
    icon: AlertCircle, 
    bgColor: 'bg-destructive/10 border-destructive/20' 
  },
  high: { 
    color: 'secondary' as const, 
    icon: AlertCircle, 
    bgColor: 'bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800' 
  },
  medium: { 
    color: 'secondary' as const, 
    icon: Info, 
    bgColor: 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800' 
  },
  low: { 
    color: 'secondary' as const, 
    icon: CheckCircle, 
    bgColor: 'bg-muted/20' 
  }
};

export default function Announcements() {
  const { currentUser } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  
  const canCreateAnnouncement = currentUser?.role === 'admin' || currentUser?.role === 'editor';
  
  const filteredAnnouncements = mockAnnouncements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = selectedPriority === 'all' || announcement.priority === selectedPriority;
    
    return matchesSearch && matchesPriority;
  });

  const pinnedAnnouncements = filteredAnnouncements.filter(a => a.isPinned);
  const regularAnnouncements = filteredAnnouncements.filter(a => !a.isPinned);

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const AnnouncementCard = ({ announcement }: { announcement: Announcement }) => {
    const config = priorityConfig[announcement.priority];
    const PriorityIcon = config.icon;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        <Card className={`overflow-hidden hover:shadow-lg transition-all duration-300 ${
          announcement.isPinned ? 'ring-2 ring-primary/20 bg-primary/5' : ''
        } ${config.bgColor}`}>
          {announcement.isPinned && (
            <div className="bg-primary/10 border-b border-primary/20 px-4 py-2">
              <div className="flex items-center text-sm text-primary">
                <Pin className="w-4 h-4 mr-2" />
                Pinned Announcement
              </div>
            </div>
          )}
          
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={announcement.author.avatar} alt={announcement.author.name} />
                  <AvatarFallback>
                    {announcement.author.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-foreground">{announcement.author.name}</h4>
                    <Badge variant={announcement.author.role === 'staff' ? 'default' : 'secondary'} className="text-xs">
                      {announcement.author.role}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{announcement.author.department}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(announcement.createdAt, { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge 
                  variant={config.color} 
                  className="flex items-center space-x-1"
                >
                  <PriorityIcon className="w-3 h-3" />
                  <span className="capitalize">{announcement.priority}</span>
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {announcement.category}
                </Badge>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="text-lg font-bold text-foreground mb-2">
                {announcement.title}
              </h3>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="prose prose-sm max-w-none text-foreground">
              <p className="whitespace-pre-wrap leading-relaxed">
                {announcement.content}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
        <div className="text-center sm:text-left space-y-2">
          <h1 className="text-3xl font-bold text-foreground flex items-center">
            <Calendar className="w-8 h-8 mr-3 text-primary" />
            Announcements
          </h1>
          <p className="text-muted-foreground">
            Stay updated with important news and updates from GCET
          </p>
        </div>
        
        {canCreateAnnouncement && (
          <Button 
            className="flex items-center space-x-2 bg-primary hover:bg-primary/90"
            onClick={() => {
              // TODO: Open create announcement modal/page
              console.log('Create announcement clicked');
            }}
          >
            <Plus className="w-4 h-4" />
            <span>Create Announcement</span>
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary/50"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <div className="flex space-x-2">
            {priorityOptions.map((option) => (
              <Badge
                key={option.value}
                variant={selectedPriority === option.value ? 'default' : 'secondary'}
                className="cursor-pointer hover:bg-primary/80 transition-colors"
                onClick={() => setSelectedPriority(option.value)}
              >
                {option.label}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="pt-6">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold text-foreground">{mockAnnouncements.length}</div>
            <p className="text-sm text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-6">
            <Pin className="w-8 h-8 mx-auto mb-2 text-warning" />
            <div className="text-2xl font-bold text-foreground">{pinnedAnnouncements.length}</div>
            <p className="text-sm text-muted-foreground">Pinned</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-6">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-destructive" />
            <div className="text-2xl font-bold text-foreground">
              {mockAnnouncements.filter(a => a.priority === 'urgent' || a.priority === 'high').length}
            </div>
            <p className="text-sm text-muted-foreground">High Priority</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-6">
            <Clock className="w-8 h-8 mx-auto mb-2 text-accent" />
            <div className="text-2xl font-bold text-foreground">
              {mockAnnouncements.filter(a => {
                const daysSince = (Date.now() - a.createdAt.getTime()) / (1000 * 60 * 60 * 24);
                return daysSince <= 7;
              }).length}
            </div>
            <p className="text-sm text-muted-foreground">This Week</p>
          </CardContent>
        </Card>
      </div>

      {/* Announcements List */}
      <div className="space-y-6">
        {/* Pinned Announcements */}
        {pinnedAnnouncements.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              <Pin className="w-5 h-5 mr-2 text-warning" />
              Pinned Announcements
            </h2>
            <div className="space-y-4">
              {pinnedAnnouncements.map((announcement) => (
                <AnnouncementCard key={announcement.id} announcement={announcement} />
              ))}
            </div>
          </div>
        )}

        {/* Regular Announcements */}
        {regularAnnouncements.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Recent Announcements
            </h2>
            <div className="space-y-4">
              {regularAnnouncements.map((announcement) => (
                <AnnouncementCard key={announcement.id} announcement={announcement} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredAnnouncements.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2 text-foreground">No announcements found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery 
                  ? `No announcements match "${searchQuery}"`
                  : 'No announcements available at the moment'
                }
              </p>
              {searchQuery && (
                <Button onClick={() => setSearchQuery('')} variant="outline">
                  Clear Search
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </motion.div>
  );
}