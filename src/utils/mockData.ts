import type { User, Post, Comment, Category, Badge, Announcement, Notification } from '@/types';

export const mockBadges: Badge[] = [
  { id: '1', name: 'Top Contributor', description: 'Made 100+ posts', icon: '🏆', color: '#FFD700', rarity: 'epic' },
  { id: '2', name: 'Helper', description: 'Helped many students', icon: '🤝', color: '#4169E1', rarity: 'rare' },
  { id: '3', name: 'Rising Star', description: 'New and active member', icon: '⭐', color: '#32CD32', rarity: 'common' },
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@gcet.edu',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    role: 'student',
    department: 'Computer Science',
    year: 3,
    bio: 'Passionate about AI and Machine Learning. Always ready to help fellow students!',
    badges: [mockBadges[0], mockBadges[1]],
    stats: { posts: 45, comments: 128, upvotes: 234, reputation: 1250 }
  },
  {
    id: '2',
    name: 'Dr. Sarah Wilson',
    email: 'sarah.wilson@gcet.edu',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    role: 'staff',
    department: 'Computer Science',
    bio: 'Professor of Machine Learning and AI. Here to guide and mentor students.',
    badges: [mockBadges[0]],
    stats: { posts: 23, comments: 67, upvotes: 145, reputation: 2100 }
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike.chen@gcet.edu',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
    role: 'student',
    department: 'Electrical Engineering',
    year: 2,
    bio: 'Electronics enthusiast and robotics club member.',
    badges: [mockBadges[2]],
    stats: { posts: 12, comments: 34, upvotes: 67, reputation: 450 }
  },
  {
    id: '4',
    name: 'Alex Editor',
    email: 'editor@gcet.edu',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=editor',
    role: 'editor',
    department: 'Content Management',
    bio: 'Content editor and moderator for the platform.',
    badges: [mockBadges[1]],
    stats: { posts: 15, comments: 89, upvotes: 156, reputation: 1800 }
  },
  {
    id: '5',
    name: 'Admin User',
    email: 'admin@gcet.edu',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    role: 'admin',
    department: 'Administration',
    bio: 'Platform administrator.',
    badges: [mockBadges[0], mockBadges[1]],
    stats: { posts: 5, comments: 25, upvotes: 78, reputation: 2500 }
  }
];

export const mockCategories: Category[] = [
  { id: '1', name: 'Academic', description: 'Course-related discussions', color: '#4169E1', icon: '📚' },
  { id: '2', name: 'Projects', description: 'Student projects and collaborations', color: '#32CD32', icon: '🚀' },
  { id: '3', name: 'Events', description: 'Campus events and activities', color: '#FF6347', icon: '📅' },
  { id: '4', name: 'Career', description: 'Internships and job opportunities', color: '#FFD700', icon: '💼' },
  { id: '5', name: 'General', description: 'General discussions', color: '#9370DB', icon: '💬' },
];

export const mockComments: Comment[] = [
  {
    id: '1',
    content: 'Great post! This really helped me understand the concept better.',
    author: mockUsers[1],
    createdAt: new Date('2024-01-15T10:30:00'),
    postId: '1',
    replies: [],
    votes: { upvotes: 5, downvotes: 0 }
  },
  {
    id: '2',
    content: 'I had the same question! Thanks for sharing this.',
    author: mockUsers[2],
    createdAt: new Date('2024-01-15T11:00:00'),
    postId: '1',
    replies: [
      {
        id: '3',
        content: 'Glad I could help! Feel free to ask if you have more questions.',
        author: mockUsers[0],
        createdAt: new Date('2024-01-15T11:15:00'),
        postId: '1',
        parentId: '2',
        replies: [],
        votes: { upvotes: 3, downvotes: 0 }
      }
    ],
    votes: { upvotes: 2, downvotes: 0 }
  }
];

export const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Understanding Machine Learning Algorithms: A Beginner\'s Guide',
    content: 'As we dive deeper into the world of artificial intelligence, it\'s crucial to understand the fundamental algorithms that power machine learning. In this post, I\'ll break down the most important concepts that every CS student should know.\n\n## Linear Regression\n\nLinear regression is one of the simplest yet most powerful algorithms. It helps us understand relationships between variables and make predictions.\n\n## Decision Trees\n\nDecision trees are intuitive and easy to interpret. They work by splitting data based on feature values to make predictions.\n\n## Neural Networks\n\nThe foundation of deep learning, neural networks mimic how our brain processes information.\n\nWhat are your thoughts on these algorithms? Which one do you find most interesting?',
    author: mockUsers[0],
    createdAt: new Date('2024-01-15T09:00:00'),
    updatedAt: new Date('2024-01-15T09:00:00'),
    category: mockCategories[0],
    tags: ['machine-learning', 'algorithms', 'ai', 'beginner'],
    media: [],
    reactions: [
      { id: '1', type: 'clap', user: mockUsers[1], createdAt: new Date() },
      { id: '2', type: 'fire', user: mockUsers[2], createdAt: new Date() }
    ],
    comments: mockComments,
    votes: { upvotes: 23, downvotes: 1, userVote: 'up' },
    isApproved: true,
    status: 'approved'
  },
  {
    id: '2',
    title: 'Looking for Project Partners - Smart Campus IoT System',
    content: 'Hey everyone! I\'m working on an IoT-based smart campus system for my final year project and looking for team members.\n\n**Project Overview:**\n- Smart lighting and energy management\n- Real-time occupancy tracking\n- Environmental monitoring\n- Mobile app interface\n\n**Skills needed:**\n- IoT development (Arduino/Raspberry Pi)\n- Mobile app development (React Native preferred)\n- Backend development (Node.js/Python)\n- UI/UX design\n\nThis could be a great addition to your portfolio! DM me if interested.',
    author: mockUsers[2],
    createdAt: new Date('2024-01-14T14:30:00'),
    updatedAt: new Date('2024-01-14T14:30:00'),
    category: mockCategories[1],
    tags: ['iot', 'project', 'collaboration', 'final-year'],
    media: [],
    reactions: [
      { id: '3', type: 'celebrate', user: mockUsers[0], createdAt: new Date() }
    ],
    comments: [],
    votes: { upvotes: 12, downvotes: 0 },
    isApproved: true,
    status: 'approved'
  },
  {
    id: '3',
    title: 'Tech Talk: "Future of Quantum Computing" - This Friday',
    content: '🎉 Exciting announcement! \n\nWe\'re hosting a tech talk on **"The Future of Quantum Computing"** this Friday at 4 PM in the main auditorium.\n\n**Speaker:** Dr. Alan Kumar, Senior Research Scientist at IBM Quantum\n\n**Topics covered:**\n- Quantum supremacy and its implications\n- Current quantum computing applications\n- Career opportunities in quantum research\n- Q&A session\n\n**Free pizza and refreshments!** 🍕\n\nDon\'t miss out on this amazing opportunity to learn from an industry expert. Limited seats available - register at the link in bio.\n\n#QuantumComputing #TechTalk #CareerOpportunity',
    author: mockUsers[1],
    createdAt: new Date('2024-01-13T16:00:00'),
    updatedAt: new Date('2024-01-13T16:00:00'),
    category: mockCategories[2],
    tags: ['tech-talk', 'quantum-computing', 'career', 'event'],
    media: [],
    reactions: [
      { id: '4', type: 'fire', user: mockUsers[0], createdAt: new Date() },
      { id: '5', type: 'clap', user: mockUsers[2], createdAt: new Date() }
    ],
    comments: [],
    votes: { upvotes: 34, downvotes: 0 },
    isPinned: true,
    isApproved: true,
    status: 'approved'
  }
];

export const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Mid-term Examination Schedule Released',
    content: 'The mid-term examination schedule for all departments has been released. Please check the academic portal for your exam dates and timings. Make sure to bring your student ID and required materials.',
    author: mockUsers[1],
    createdAt: new Date('2024-01-12T10:00:00'),
    priority: 'high',
    isPinned: true,
    category: 'Academic'
  },
  {
    id: '2',
    title: 'Campus WiFi Maintenance - This Weekend',
    content: 'Campus WiFi will undergo maintenance this weekend (Jan 20-21) from 2 AM to 6 AM. There might be intermittent connectivity issues during this period.',
    author: mockUsers[1],
    createdAt: new Date('2024-01-11T15:30:00'),
    priority: 'medium',
    isPinned: false,
    category: 'Infrastructure'
  }
];

// Mock pending posts for approval
export const mockPendingPosts: Post[] = [
  {
    id: 'pending-1',
    title: 'Need Help with Database Design Project',
    content: 'Hi everyone! I\'m working on my database design project and I\'m stuck on normalization. Can anyone help me understand how to properly normalize a database schema? I have a library management system and I\'m not sure if I\'m doing the relationships correctly.\n\nHere are my current tables:\n- Books (book_id, title, author, isbn, publisher, year)\n- Members (member_id, name, email, phone, address)\n- Loans (loan_id, book_id, member_id, loan_date, return_date)\n\nAny feedback would be greatly appreciated!',
    author: mockUsers[0],
    createdAt: new Date('2024-01-16T08:30:00'),
    updatedAt: new Date('2024-01-16T08:30:00'),
    category: mockCategories[0],
    tags: ['database', 'help', 'normalization', 'project'],
    media: [],
    reactions: [],
    comments: [],
    votes: { upvotes: 0, downvotes: 0 },
    isApproved: false,
    status: 'pending'
  },
  {
    id: 'pending-2',
    title: 'Study Group for Data Structures Exam',
    content: 'Hey CS students! I\'m forming a study group for the upcoming Data Structures exam. We\'ll be covering:\n\n- Arrays and Linked Lists\n- Stacks and Queues\n- Trees and Binary Search Trees\n- Graphs and Graph Algorithms\n- Hash Tables\n\nWho\'s interested? We can meet at the library this weekend.',
    author: mockUsers[2],
    createdAt: new Date('2024-01-16T10:15:00'),
    updatedAt: new Date('2024-01-16T10:15:00'),
    category: mockCategories[0],
    tags: ['study-group', 'data-structures', 'exam'],
    media: [],
    reactions: [],
    comments: [],
    votes: { upvotes: 0, downvotes: 0 },
    isApproved: false,
    status: 'pending'
  }
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'post_like',
    title: 'New reaction on your post',
    message: 'Dr. Sarah Wilson reacted with 🔥 to your post "Understanding Machine Learning Algorithms"',
    read: false,
    createdAt: new Date('2024-01-15T11:30:00'),
    relatedPostId: '1',
    relatedUserId: '2'
  },
  {
    id: '2',
    type: 'comment',
    title: 'New comment on your post',
    message: 'Mike Chen commented on your post "Understanding Machine Learning Algorithms"',
    read: false,
    createdAt: new Date('2024-01-15T11:00:00'),
    relatedPostId: '1',
    relatedUserId: '3'
  },
  {
    id: '3',
    type: 'announcement',
    title: 'New announcement',
    message: 'Mid-term Examination Schedule Released',
    read: true,
    createdAt: new Date('2024-01-12T10:00:00')
  }
];