import { useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Plus, Bell, Trophy, User, Settings, BookOpen, 
  MessageSquare, Calendar, Shield, LogOut, Menu, X,
  GraduationCap, Edit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store';
import { cn } from '@/lib/utils';

const getNavigationItems = (userRole: string) => {
  const baseItems = [
    { title: 'Home', icon: Home, href: '/', roles: ['student', 'staff', 'editor', 'admin'] },
    { title: 'Create Post', icon: Plus, href: '/create', roles: ['student', 'staff', 'editor', 'admin'] },
    { title: 'Leaderboard', icon: Trophy, href: '/leaderboard', roles: ['student', 'staff', 'editor', 'admin'] },
    { title: 'Notifications', icon: Bell, href: '/notifications', roles: ['student', 'staff', 'editor', 'admin'] },
    { title: 'Profile', icon: User, href: '/profile', roles: ['student', 'staff', 'editor', 'admin'] },
  ];

  const roleSpecificItems = [
    { title: 'Announcements', icon: Calendar, href: '/announcements', roles: ['staff', 'editor', 'admin'] },
    { title: 'Editor Panel', icon: Edit, href: '/editor', roles: ['editor', 'admin'] },
    { title: 'Admin Panel', icon: Shield, href: '/admin', roles: ['admin'] },
    { title: 'Settings', icon: Settings, href: '/settings', roles: ['student', 'staff', 'editor', 'admin'] },
  ];

  return [...baseItems, ...roleSpecificItems].filter(item => 
    item.roles.includes(userRole)
  );
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const { currentUser, unreadNotifications } = useAppStore();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const navigationItems = getNavigationItems(currentUser?.role || 'student');

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <motion.aside
            ref={sidebarRef}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed left-0 top-0 z-50 h-screen w-80 bg-card border-r border-border flex flex-col shadow-lg"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">GCET BLOG</h2>
                  <p className="text-xs text-muted-foreground">The Digital Voice of GCET</p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="hover:bg-secondary"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all',
                        'hover:bg-secondary/80 group relative',
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'text-muted-foreground hover:text-foreground'
                      )
                    }
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">
                      {item.title}
                    </span>
                    
                    {/* Notification badge */}
                    {item.href === '/notifications' && unreadNotifications > 0 && (
                      <span className="ml-auto bg-destructive text-destructive-foreground text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                        {unreadNotifications}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            {/* User Profile */}
            {currentUser && (
              <div className="p-4 border-t border-border">
                <div className="flex items-center space-x-3">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {currentUser.department}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
