import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Moon, Sun, Bell, Lock, User, Palette, 
  Shield, HelpCircle, LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/store';
import { toast } from '@/hooks/use-toast';

export default function Settings() {
  const { theme, toggleTheme, currentUser } = useAppStore();
  const [notifications, setNotifications] = useState({
    posts: true,
    comments: true,
    reactions: false,
    mentions: true,
    announcements: true
  });

  const [profile, setProfile] = useState({
    name: currentUser?.name || '',
    bio: currentUser?.bio || '',
    email: currentUser?.email || ''
  });

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handleProfileChange = (key: string, value: string) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveProfile = () => {
    toast({
      title: "Profile updated",
      description: "Your profile has been saved successfully."
    });
  };

  const handleExportData = () => {
    toast({
      title: "Data export started",
      description: "Your data export will be ready shortly."
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account preferences and privacy settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  value={profile.bio}
                  onChange={(e) => handleProfileChange('bio', e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <Button onClick={handleSaveProfile}>Save Changes</Button>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Theme</Label>
                  <p className="text-sm text-muted-foreground">
                    Choose your preferred theme
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Sun className="w-4 h-4" />
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={toggleTheme}
                  />
                  <Moon className="w-4 h-4" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications for {key.toLowerCase()}
                    </p>
                  </div>
                  <Switch
                    checked={value}
                    onCheckedChange={(checked) => handleNotificationChange(key, checked)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Profile Visibility</Label>
                  <p className="text-sm text-muted-foreground">
                    Make your profile visible to other users
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Online Status</Label>
                  <p className="text-sm text-muted-foreground">
                    Let others know when you're online
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <Button variant="outline" className="w-full">
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </Button>
              
              <Button variant="outline" onClick={handleExportData} className="w-full">
                Export My Data
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <HelpCircle className="w-4 h-4 mr-2" />
                Help & Support
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                Privacy Policy
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                Terms of Service
              </Button>
              
              <Separator />
              
              <Button variant="destructive" className="w-full justify-start">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Member since:</span>
                <span>January 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Posts created:</span>
                <span>{currentUser?.stats.posts || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reputation:</span>
                <span>{currentUser?.stats.reputation || 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}