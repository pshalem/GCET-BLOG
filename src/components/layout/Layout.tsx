import { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAppStore } from '@/store';
import { mockPosts, mockNotifications, mockPendingPosts } from '@/utils/mockData';
import { useIsMobile } from '@/hooks/use-mobile';

export function Layout() {
  const { theme, currentUser, isAuthenticated, setPosts, setNotifications, setPendingPosts } = useAppStore();
  const isMobile = useIsMobile();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Redirect to login if not authenticated
  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Initialize app with mock data
  useEffect(() => {
    setPosts(mockPosts);
    setNotifications(mockNotifications);
    setPendingPosts(mockPendingPosts);

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme, setPosts, setNotifications, setPendingPosts]);

  const handleMenuClick = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar - Always rendered but positioned properly */}
        <Sidebar 
          isMobileOpen={isMobileSidebarOpen} 
          setIsMobileOpen={setIsMobileSidebarOpen} 
        />
        
        {/* Main Content Area */}
        <div className={cn(
          "flex-1 flex flex-col overflow-hidden transition-all duration-300",
          isMobile && isMobileSidebarOpen ? "ml-0" : "ml-0"
        )}>
          {/* Header */}
          <Header onMenuClick={handleMenuClick} />
          
          {/* Page Content */}
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-auto bg-background p-4 sm:p-6"
          >
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </motion.main>
        </div>
      </div>
    </div>
  );
}

// Add cn utility if not available
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
