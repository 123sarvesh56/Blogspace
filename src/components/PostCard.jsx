import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Bookmark, Share2, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const PostCard = ({ post, showActions = true }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked || false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to like posts');
      return;
    }
    
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    toast.success(isLiked ? 'Post unliked' : 'Post liked');
  };

  const handleBookmark = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to bookmark posts');
      return;
    }
    
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? 'Bookmark removed' : 'Post bookmarked');
  };

  const handleShare = (e) => {
    e.preventDefault();
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: `/post/${post.slug}`
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/post/${post.slug}`);
      toast.success('Link copied to clipboard');
    }
  };

  const readingTime = Math.ceil(post.content.split(' ').length / 200);

  return (
    <article className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200 dark:border-gray-700">
      <Link to={`/post/${post.slug}`}>
        <div className="aspect-video bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-3">
          <div className="flex items-center space-x-2">
            <img
              src={post.author.avatar}
              alt={post.author.username}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {post.author.username}
            </span>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {readingTime} min read
          </span>
        </div>

        <Link to={`/post/${post.slug}`}>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            {post.title}
          </h2>
        </Link>
        
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        {showActions && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-1 transition-colors ${
                  isLiked 
                    ? 'text-red-600' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-red-600'
                }`}
              >
                <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                <span className="text-sm">{likeCount}</span>
              </button>
              
              <Link
                to={`/post/${post.slug}#comments`}
                className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-indigo-600 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                <span className="text-sm">{post.comments}</span>
              </Link>
              
              <span className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                <Eye className="h-5 w-5" />
                <span className="text-sm">{post.views}</span>
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleBookmark}
                className={`p-2 rounded-lg transition-colors ${
                  isBookmarked
                    ? 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900'
                    : 'text-gray-500 dark:text-gray-400 hover:text-indigo-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
              
              <button
                onClick={handleShare}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-indigo-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default PostCard;