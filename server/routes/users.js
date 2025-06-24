import express from 'express';
import User from '../models/User.js';
import Post from '../models/Post.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get user profile
// @route   GET /api/users/:username
// @access  Public
router.get('/:username', async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const stats = await user.getStats();

    res.json({
      success: true,
      data: {
        ...user.toObject(),
        stats
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Follow/Unfollow user
// @route   POST /api/users/:id/follow
// @access  Private
router.post('/:id/follow', protect, async (req, res, next) => {
  try {
    const userToFollow = await User.findById(req.params.id);

    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (userToFollow._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot follow yourself'
      });
    }

    const currentUser = await User.findById(req.user._id);
    const isFollowing = currentUser.following.includes(userToFollow._id);

    if (isFollowing) {
      // Unfollow
      currentUser.following.pull(userToFollow._id);
      userToFollow.followers.pull(currentUser._id);
    } else {
      // Follow
      currentUser.following.push(userToFollow._id);
      userToFollow.followers.push(currentUser._id);
    }

    await Promise.all([currentUser.save(), userToFollow.save()]);

    res.json({
      success: true,
      message: isFollowing ? 'User unfollowed' : 'User followed',
      data: {
        isFollowing: !isFollowing,
        followersCount: userToFollow.followers.length
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get user's bookmarks
// @route   GET /api/users/bookmarks
// @access  Private
router.get('/me/bookmarks', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'bookmarks',
        populate: {
          path: 'author',
          select: 'username avatar'
        }
      });

    res.json({
      success: true,
      data: user.bookmarks
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get user's followers
// @route   GET /api/users/:id/followers
// @access  Public
router.get('/:id/followers', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('followers', 'username avatar bio')
      .select('followers');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user.followers
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get user's following
// @route   GET /api/users/:id/following
// @access  Public
router.get('/:id/following', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('following', 'username avatar bio')
      .select('following');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user.following
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Search users
// @route   GET /api/users/search
// @access  Public
router.get('/search', async (req, res, next) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { bio: { $regex: q, $options: 'i' } }
      ],
      isActive: true
    })
      .select('username avatar bio location')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { bio: { $regex: q, $options: 'i' } }
      ],
      isActive: true
    });

    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;