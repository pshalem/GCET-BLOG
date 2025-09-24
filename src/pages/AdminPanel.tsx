import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Users, MessageSquare, Flag, BarChart3, 
  Settings, FileText, CheckCircle, XCircle, Eye,
  TrendingUp, AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppStore } from '@/store';
import { mockUsers, mockPosts } from '@/utils/mockData';
import { formatDistanceToNow } from 'date-fns';

const adminStats = [
  { title: 'Total Users', value: '1,234', icon: Users, color: 'text-primary', change: '+12%' },
  { title: 'Active Posts', value: '456', icon: MessageSquare, color: 'text-accent', change: '+8%' },
  { title: 'Pending Reviews', value: '23', icon: Flag, color: 'text-warning', change: '-5%' },
  { title: 'Reports', value: '7', icon: AlertTriangle, color: 'text-destructive', change: '+2%' },
];

const pendingPosts = mockPosts.filter(post => !post.isApproved);
const recentUsers = mockUsers.slice(0, 5);

export default function AdminPanel() {
  const { currentUser } = useAppStore();
  const [activeTab, setActiveTab] = useState('overview');

  // Redirect if not admin
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">Access Denied</h3>
            <p className="text-muted-foreground">
              You don't have permission to access the admin panel.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleApprovePost = (postId: string) => {
    console.log('Approving post:', postId);
  };

  const handleRejectPost = (postId: string) => {
    console.log('Rejecting post:', postId);
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
            <Shield className="w-8 h-8 mr-3 text-primary" />
            Admin Panel
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage users, content, and platform settings
          </p>
        </div>
        <Badge variant="default" className="text-sm">
          Admin Access
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminStats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="flex items-center space-x-1 mt-1">
                <TrendingUp className="w-3 h-3 text-success" />
                <span className="text-xs text-success">{stat.change}</span>
                <span className="text-xs text-muted-foreground">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-muted-foreground">New user registered</span>
                    <span className="text-xs text-muted-foreground ml-auto">2m ago</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-muted-foreground">Post approved</span>
                    <span className="text-xs text-muted-foreground ml-auto">5m ago</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-warning rounded-full"></div>
                    <span className="text-muted-foreground">Content reported</span>
                    <span className="text-xs text-muted-foreground ml-auto">10m ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Users
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Review Posts
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Flag className="w-4 h-4 mr-2" />
                  Handle Reports
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Platform Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-foreground">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={user.role === 'staff' ? 'default' : 'secondary'} className="text-xs">
                            {user.role}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{user.department}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingPosts.length > 0 ? (
                <div className="space-y-4">
                  {pendingPosts.map((post) => (
                    <div key={post.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={post.author.avatar} alt={post.author.name} />
                            <AvatarFallback>
                              {post.author.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium text-foreground">{post.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              by {post.author.name} • {formatDistanceToNow(post.createdAt, { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">Pending</Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {post.content}
                      </p>
                      
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleApprovePost(post.id)}
                          className="bg-success hover:bg-success/90"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleRejectPost(post.id)}
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          Reject
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3 mr-1" />
                          View Full
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 text-success opacity-50" />
                  <p className="text-muted-foreground">No pending content to review</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Flag className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No reports to review</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}