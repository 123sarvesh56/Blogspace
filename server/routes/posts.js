import express from 'express';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { validatePost } from '../middleware/validation.js';

const router = express.Router();

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const {
      search,
      tag,
      author,
      status = 'published',
      sort = '-createdAt'
    } = req.query;

    // Build query
    const query = { status };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    if (tag) {
      query.tags = { $in: [tag] };
    }

    if (author) {
      const authorUser = await User.findOne({ username: author });
      if (authorUser) {
        query.author = authorUser._id;
      }
    }

    // Get posts with pagination
    const posts = await Post.find(query)
      .populate('author', 'username avatar')
      .populate('commentCount')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // Add user-specific data if authenticated
    const postsWithUserData = await Promise.all(posts.map(async (post) => {
      const postObj = post.toObject();
      
      if (req.user) {
        postObj.isLiked = post.likedBy.includes(req.user._id);
        postObj.isBookmarked = req.user.bookmarks.includes(post._id);
      }
      
      return postObj;
    }));

    const total = await Post.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: postsWithUserData,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single post
// @route   GET /api/posts/:slug
// @access  Public
router.get('/:slug', optionalAuth, async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug })
      .populate('author', 'username avatar bio')
      .populate('commentCount');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Increment view count
    post.views += 1;
    await post.save();

    const postObj = post.toObject();

    // Add user-specific data if authenticated
    if (req.user) {
      postObj.isLiked = post.likedBy.includes(req.user._id);
      postObj.isBookmarked = req.user.bookmarks.includes(post._id);
    }

    res.json({
      success: true,
      data: postObj
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
router.post('/', protect, validatePost, async (req, res, next) => {
  try {
    const postData = {
      ...req.body,
      author: req.user._id
    };

    const post = await Post.create(postData);
    await post.populate('author', 'username avatar');

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
router.put('/:id', protect, validatePost, async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check ownership or admin role
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post'
      });
    }

    post = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'username avatar');

    res.json({
      success: true,
      message: 'Post updated successfully',
      data: post
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check ownership or admin role
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post'
      });
    }

    // Delete associated comments
    await Comment.deleteMany({ post: post._id });

    // Remove from user bookmarks
    await User.updateMany(
      { bookmarks: post._id },
      { $pull: { bookmarks: post._id } }
    );

    await post.deleteOne();

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Like/Unlike post
// @route   POST /api/posts/:id/like
// @access  Private
router.post('/:id/like', protect, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const isLiked = post.likedBy.includes(req.user._id);

    if (isLiked) {
      // Unlike
      post.likedBy.pull(req.user._id);
      post.likes -= 1;
    } else {
      // Like
      post.likedBy.push(req.user._id);
      post.likes += 1;
    }

    await post.save();

    res.json({
      success: true,
      message: isLiked ? 'Post unliked' : 'Post liked',
      data: {
        likes: post.likes,
        isLiked: !isLiked
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Bookmark/Unbookmark post
// @route   POST /api/posts/:id/bookmark
// @access  Private
router.post('/:id/bookmark', protect, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const user = await User.findById(req.user._id);
    const isBookmarked = user.bookmarks.includes(post._id);

    if (isBookmarked) {
      // Remove bookmark
      user.bookmarks.pull(post._id);
    } else {
      // Add bookmark
      user.bookmarks.push(post._id);
    }

    await user.save();

    res.json({
      success: true,
      message: isBookmarked ? 'Bookmark removed' : 'Post bookmarked',
      data: {
        isBookmarked: !isBookmarked
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get user's posts
// @route   GET /api/posts/user/:username
// @access  Public
router.get('/user/:username', async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const posts = await Post.find({ 
      author: user._id, 
      status: 'published' 
    })
      .populate('author', 'username avatar')
      .populate('commentCount')
      .sort('-createdAt');

    res.json({
      success: true,
      data: posts
    });
  } catch (error) {
    next(error);
  }
});

export default router;