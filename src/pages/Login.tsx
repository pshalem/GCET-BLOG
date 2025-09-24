import { useState } from 'react';
import { motion } from 'framer-motion';
import collegeBg from '@/assets/college-bg.jpg';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppStore } from '@/store';
import { mockUsers } from '@/utils/mockData';
import { toast } from '@/hooks/use-toast';

export default function Login() {
  const navigate = useNavigate();
  const { setCurrentUser, setAuthenticated } = useAppStore();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    role: 'student' as 'student' | 'staff' | 'editor' | 'admin'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (isLogin) {
        // Mock login - find user by email or create demo user with selected role
        let user = mockUsers.find(u => u.email === formData.email);
        
        // If not found, create a demo user with the selected role
        if (!user) {
          user = {
            id: Date.now().toString(),
            name: formData.email.split('@')[0],
            email: formData.email,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.email}`,
            role: formData.role,
            department: 'Computer Science',
            year: formData.role === 'student' ? 3 : undefined,
            badges: [],
            stats: { posts: 0, comments: 0, upvotes: 0, reputation: 100 }
          };
        }
        
        setCurrentUser(user);
        setAuthenticated(true);
        toast({
          title: "Welcome back!",
          description: `Signed in as ${user.role}`,
        });
        
        // Role-based navigation
        switch (user.role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'editor':
            navigate('/editor');
            break;
          default:
            navigate('/');
        }
      } else {
        // Mock signup
        const newUser = {
          id: Date.now().toString(),
          name: formData.name,
          email: formData.email,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`,
          role: formData.role,
          department: 'Computer Science',
          year: formData.role === 'student' ? 1 : undefined,
          badges: [],
          stats: { posts: 0, comments: 0, upvotes: 0, reputation: 100 }
        };
        
        setCurrentUser(newUser);
        setAuthenticated(true);
        toast({
          title: "Account created!",
          description: "Welcome to GCET BLOG Platform",
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast({
      title: "Google Sign-In",
      description: "Google authentication would be implemented here",
    });
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `url(${collegeBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">GCET BLOG</h1>
              <p className="text-xs text-muted-foreground">The Digital Voice of GCET</p>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-foreground">
            {isLogin ? 'Welcome back!' : 'Join our community'}
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {isLogin ? 'Sign in to your account' : 'Create your account to get started'}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {isLogin ? 'Sign In' : 'Create Account'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required={!isLogin}
                  />
                </div>
              )}

              {/* Role Selection */}
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="staff">Staff/Faculty</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 h-full px-3"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="pl-10"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </Button>
            </form>

            <div className="relative">
              <Separator />
              <div className="absolute inset-0 flex items-center justify-center">
                <Badge variant="secondary" className="bg-background px-2">or</Badge>
              </div>
            </div>

            <Button 
              type="button" 
              variant="outline" 
              className="w-full"
              onClick={handleGoogleLogin}
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </Button>
            </div>

            {isLogin && (
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-2">Demo accounts:</p>
                <div className="space-y-1 text-xs">
                  <p><strong>Student:</strong> john.doe@gcet.edu</p>
                  <p><strong>Staff:</strong> sarah.wilson@gcet.edu</p>
                  <p><strong>Editor:</strong> editor@gcet.edu</p>
                  <p><strong>Admin:</strong> admin@gcet.edu</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-4">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </motion.div>
    </div>
  );
}