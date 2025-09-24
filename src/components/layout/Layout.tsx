import { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAppStore } from '@/store';
import { mockPosts, mockNotifications, mockPendingPosts } from '@/utils/mockData';

export function Layout() {
  const { theme, currentUser, isAuthenticated, setPosts, setNotifications, setPendingPosts } = useAppStore();

  // Redirect to login if not authenticated
  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Initialize app with mock data
  useEffect(() => {
    // Load initial data
    setPosts(mockPosts);
    setNotifications(mockNotifications);
    setPendingPosts(mockPendingPosts);

    // Apply theme on initial load
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme, setPosts, setNotifications, setPendingPosts]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <Header />
          
          {/* Page Content */}
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-auto bg-background p-6"
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