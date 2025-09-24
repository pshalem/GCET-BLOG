import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Post, Comment, Notification } from '@/types';

interface AppState {
  // User state
  currentUser: User | null;
  isAuthenticated: boolean;
  
  // UI state
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  
  // Data state
  posts: Post[];
  pendingPosts: Post[];
  notifications: Notification[];
  unreadNotifications: number;
  
  // Actions
  setCurrentUser: (user: User | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  logout: () => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setPosts: (posts: Post[]) => void;
  addPost: (post: Post) => void;
  updatePost: (postId: string, updates: Partial<Post>) => void;
  approvePost: (postId: string) => void;
  rejectPost: (postId: string, reason?: string) => void;
  setPendingPosts: (posts: Post[]) => void;
  setNotifications: (notifications: Notification[]) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentUser: null,
      isAuthenticated: false,
      theme: 'light',
      sidebarCollapsed: false,
      posts: [],
      pendingPosts: [],
      notifications: [],
      unreadNotifications: 0,

      // Actions
      setCurrentUser: (user) => set({ currentUser: user }),
      setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
      logout: () => set({ currentUser: null, isAuthenticated: false }),
      
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
        
        // Apply theme to document
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
      
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      
      setPosts: (posts) => set({ posts }),
      
      addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
      
      updatePost: (postId, updates) => set((state) => ({
        posts: state.posts.map(post =>
          post.id === postId ? { ...post, ...updates } : post
        ),
        pendingPosts: state.pendingPosts.map(post =>
          post.id === postId ? { ...post, ...updates } : post
        )
      })),
      
      approvePost: (postId) => set((state) => {
        const post = state.pendingPosts.find(p => p.id === postId);
        if (post) {
          const approvedPost = { ...post, isApproved: true, status: 'approved' as const };
          return {
            posts: [approvedPost, ...state.posts],
            pendingPosts: state.pendingPosts.filter(p => p.id !== postId)
          };
        }
        return state;
      }),
      
      rejectPost: (postId, reason) => set((state) => ({
        pendingPosts: state.pendingPosts.map(post =>
          post.id === postId 
            ? { ...post, status: 'rejected' as const, rejectionReason: reason }
            : post
        )
      })),
      
      setPendingPosts: (posts) => set({ pendingPosts: posts }),
      
      setNotifications: (notifications) => {
        const unreadCount = notifications.filter(n => !n.read).length;
        set({ notifications, unreadNotifications: unreadCount });
      },
      
      markNotificationRead: (notificationId) => set((state) => {
        const updatedNotifications = state.notifications.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        );
        const unreadCount = updatedNotifications.filter(n => !n.read).length;
        return { notifications: updatedNotifications, unreadNotifications: unreadCount };
      }),
      
      markAllNotificationsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true })),
        unreadNotifications: 0
      })),
    }),
    {
      name: 'gcet-app-storage',
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);