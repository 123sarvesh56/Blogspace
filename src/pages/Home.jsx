import React, { useState, useEffect } from 'react';
import { Search, Filter, TrendingUp, Calendar, User } from 'lucide-react';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';

// Mock data
const mockPosts = [
  {
    id: '1',
    title: 'Getting Started with React Hooks',
    slug: 'getting-started-with-react-hooks',
    excerpt: 'Learn how to use React Hooks to build modern, functional components with state and lifecycle methods.',
    content: '<p>React Hooks revolutionized how we write React components...</p>',
    image: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=800',
    author: {
      id: '2',
      username: 'johndoe',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    tags: ['react', 'javascript', 'hooks'],
    likes: 42,
    comments: 8,
    views: 256,
    createdAt: '2024-01-15T10:30:00Z',
    isLiked: false,
    isBookmarked: false
  },
  {
    id: '2',
    title: 'Building Scalable Node.js Applications',
    slug: 'building-scalable-nodejs-applications',
    excerpt: 'Best practices for building and deploying Node.js applications that can handle millions of users.',
    content: '<p>When building Node.js applications for scale...</p>',
    image: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=800',
    author: {
      id: '1',
      username: 'admin',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    tags: ['nodejs', 'backend', 'scalability'],
    likes: 67,
    comments: 12,
    views: 423,
    createdAt: '2024-01-14T15:45:00Z',
    isLiked: true,
    isBookmarked: false
  },
  {
    id: '3',
    title: 'Modern CSS Grid Layouts',
    slug: 'modern-css-grid-layouts',
    excerpt: 'Master CSS Grid to create complex, responsive layouts with ease. Learn the fundamentals and advanced techniques.',
    content: '<p>CSS Grid is one of the most powerful layout systems...</p>',
    image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
    author: {
      id: '2',
      username: 'johndoe',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    tags: ['css', 'grid', 'layout', 'responsive'],
    likes: 34,
    comments: 5,
    views: 189,
    createdAt: '2024-01-13T09:20:00Z',
    isLiked: false,
    isBookmarked: true
  },
  {
    id: '4',
    title: 'Database Design Principles',
    slug: 'database-design-principles',
    excerpt: 'Learn the fundamental principles of database design, normalization, and optimization for better performance.',
    content: '<p>Good database design is crucial for application performance...</p>',
    image: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=800',
    author: {
      id: '1',
      username: 'admin',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    tags: ['database', 'sql', 'mongodb', 'design'],
    likes: 89,
    comments: 15,
    views: 567,
    createdAt: '2024-01-12T14:10:00Z',
    isLiked: false,
    isBookmarked: false
  }
];

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortBy, setSortBy] = useState('latest');

  const allTags = [...new Set(mockPosts.flatMap(post => post.tags))];

  useEffect(() => {
    // Simulate API call
    const loadPosts = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPosts(mockPosts);
      setLoading(false);
    };

    loadPosts();
  }, []);

  const filteredPosts = posts
    .filter(post => 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(post => selectedTag === '' || post.tags.includes(selectedTag))
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.likes - a.likes;
        case 'views':
          return b.views - a.views;
        case 'latest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to BlogSpace
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Discover amazing stories, share your thoughts, and connect with fellow writers
          </p>
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search articles, topics, or authors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-full text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Topics</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>
                  #{tag}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-gray-500 dark:text-gray-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="latest">
                <Calendar className="inline h-4 w-4 mr-1" />
                Latest
              </option>
              <option value="popular">
                <TrendingUp className="inline h-4 w-4 mr-1" />
                Most Popular
              </option>
              <option value="views">Most Viewed</option>
            </select>
          </div>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="xl" />
          </div>
        ) : (
          <>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 dark:text-gray-500 mb-4">
                  <Search className="h-12 w-12 mx-auto mb-4" />
                  <p className="text-xl">No posts found</p>
                  <p>Try adjusting your search or filters</p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Featured Authors Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Featured Authors</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                username: 'admin',
                avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
                posts: 15,
                followers: 342
              },
              {
                username: 'johndoe',
                avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200',
                posts: 8,
                followers: 156
              },
              {
                username: 'sarah_writer',
                avatar: 'https://images.pexels.com/photos/1391498/pexels-photo-1391498.jpeg?auto=compress&cs=tinysrgb&w=200',
                posts: 23,
                followers: 478
              },
              {
                username: 'tech_guru',
                avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200',
                posts: 31,
                followers: 623
              }
            ].map(author => (
              <div key={author.username} className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center border border-gray-200 dark:border-gray-700">
                <img
                  src={author.avatar}
                  alt={author.username}
                  className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  @{author.username}
                </h3>
                <div className="flex justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>{author.posts} Posts</span>
                  <span>{author.followers} Followers</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;