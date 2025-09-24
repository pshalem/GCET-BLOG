export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'student' | 'staff' | 'editor' | 'admin';
  department: string;
  year?: number;
  bio?: string;
  badges: Badge[];
  stats: {
    posts: number;
    comments: number;
    upvotes: number;
    reputation: number;
  };
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: User;
  createdAt: Date;
  updatedAt: Date;
  category: Category;
  tags: string[];
  media: MediaFile[];
  reactions: Reaction[];
  comments: Comment[];
  votes: {
    upvotes: number;
    downvotes: number;
    userVote?: 'up' | 'down';
  };
  isPinned?: boolean;
  isApproved: boolean;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: Date;
  postId: string;
  parentId?: string;
  replies: Comment[];
  votes: {
    upvotes: number;
    downvotes: number;
    userVote?: 'up' | 'down';
  };
}

export interface Reaction {
  id: string;
  type: 'like' | 'celebrate' | 'fire' | 'clap';
  user: User;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}

export interface MediaFile {
  id: string;
  url: string;
  type: 'image' | 'video' | 'pdf' | 'document';
  name: string;
  size: number;
}

export interface Notification {
  id: string;
  type: 'post_like' | 'comment' | 'mention' | 'announcement';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  relatedPostId?: string;
  relatedUserId?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: User;
  createdAt: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isPinned: boolean;
  category: string;
}