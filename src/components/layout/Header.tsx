import { useState } from 'react';
import { Search, Bell, Moon, Sun, User, LogOut, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { theme, toggleTheme, currentUser, unreadNotifications, logout } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left side - Menu button and title on mobile */}
        <div className="flex items-center space-x-4">
          {/* Hamburger Menu Button - Only one button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="hover:bg-secondary"
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* App Title - Show on mobile */}
          {isMobile && (
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-primary rounded flex items-center justify-center">
                <GraduationCap className="w-3 h-3 text-white" />
              </div>
              <span className="font-bold text-sm">GCET BLOG</span>
            </div>
          )}
        </div>

        {/* Search Bar - Hidden on mobile when sidebar is open */}
        <div className={cn(
          "flex-1 max-w-md mx-4",
          isMobile ? "max-w-xs" : ""
        )}>
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search posts, users, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 w-full bg-secondary/50 border-0 focus:bg-background transition-colors"
            />
          </form>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Theme Toggle - Hidden on mobile */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hover:bg-secondary hidden sm:flex"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-secondary"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifications > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs min-w-[18px] h-[18px] flex items-center justify-center"
              >
                {unreadNotifications > 99 ? '99+' : unreadNotifications}
              </Badge>
            )}
          </Button>

          {/* User Menu */}
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                    <AvatarFallback>
                      {currentUser.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{currentUser.name}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {currentUser.email}
                    </p>
                    <Badge variant="secondary" className="w-fit text-xs">
                      {currentUser.role}
                    </Badge>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/notifications')}>
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Notifications</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="default" size="sm" onClick={() => navigate('/login')}>
              Sign In
            </Button>
          )}
        </div>
      </div>
    </motion.header>
  );
}
