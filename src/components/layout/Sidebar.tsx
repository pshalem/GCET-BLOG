import { useState, useEffect } from 'react';
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
import { useIsMobile } from '@/hooks/use-mobile'; // Import the hook

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

export function Sidebar() {
  const location = useLocation();
  const { sidebarCollapsed, toggleSidebar, currentUser, unreadNotifications } = useAppStore();
  const isMobile = useIsMobile();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopOpen, setIsDesktopOpen] = useState(!sidebarCollapsed);

  const navigationItems = getNavigationItems(currentUser?.role || 'student');

  // Determine if sidebar should be visible
  const isOpen = isMobile ? isMobileOpen : isDesktopOpen;

  const handleToggle = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      toggleSidebar();
      setIsDesktopOpen(!isDesktopOpen);
    }
  };

  // Close mobile sidebar when route changes
  useEffect(() => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Close mobile sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileOpen]);

  const sidebarVariants = {
    open: { 
      x: 0,
      width: isMobile ? '280px' : '280px',
      opacity: 1 
    },
    closed: { 
      x: isMobile ? '-100%' : 0,
      width: isMobile ? '0px' : '80px',
      opacity: 1 
    }
  };

  const contentVariants = {
    open: { opacity: 1, display: 'block' },
    closed: { opacity: 0, display: 'none' }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        animate={isOpen ? 'open' : 'closed'}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={cn(
          'fixed left-0 top-0 z-50 h-screen bg-card border-r border-border',
          'flex flex-col shadow-lg lg:relative lg:z-auto',
          !isOpen && !isMobile && 'lg:w-20'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border min-h-[64px]">
          <motion.div
            variants={contentVariants}
            animate={isOpen ? 'open' : 'closed'}
            className="flex items-center space-x-3"
          >
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">GCET BLOG</h2>
              <p className="text-xs text-muted-foreground">The Digital Voice of GCET</p>
            </div>
          </motion.div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggle}
            className="hover:bg-secondary"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
                <motion.span
                  variants={contentVariants}
                  animate={isOpen ? 'open' : 'closed'}
                  className="font-medium"
                >
                  {item.title}
                </motion.span>
                
                {/* Notification badge */}
                {item.href === '/notifications' && unreadNotifications > 0 && (
                  <motion.span
                    variants={contentVariants}
                    animate={isOpen ? 'open' : 'closed'}
                    className="ml-auto bg-destructive text-destructive-foreground text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center"
                  >
                    {unreadNotifications}
                  </motion.span>
                )}

                {/* Tooltip for collapsed state */}
                {!isOpen && !isMobile && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {item.title}
                  </div>
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
              <motion.div
                variants={contentVariants}
                animate={isOpen ? 'open' : 'closed'}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-medium text-foreground truncate">
                  {currentUser.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {currentUser.department}
                </p>
              </motion.div>
            </div>
          </div>
        )}
      </motion.aside>
    </>
  );
}
