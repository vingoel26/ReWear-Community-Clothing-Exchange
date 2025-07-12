import User from '../models/User.js';
import { validationResult } from 'express-validator';
import { uploadOnCloudinary ,deleteOnCloudinary} from '../utils/cloudinary.js';

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.json({
      success: true,
      users,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: users.length,
        totalUsers: total
      }
    });

  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { firstName, lastName, username } = req.body;
    const userId = req.user.userId;

    // Check if username is already taken by another user
    if (username) {
      const existingUser = await User.findOne({ 
        username, 
        _id: { $ne: userId } 
      });
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username already taken'
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        username,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Delete user (Admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Toggle user status (Admin only)
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from deactivating themselves
    if (user._id.toString() === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change your own status'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isActive: user.isActive
      }
    });

  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Search users (Admin only)
const searchUsers = async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const searchRegex = new RegExp(q, 'i');
    const users = await User.find({
      $or: [
        { username: searchRegex },
        { email: searchRegex },
        { firstName: searchRegex },
        { lastName: searchRegex }
      ]
    })
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

    const total = await User.countDocuments({
      $or: [
        { username: searchRegex },
        { email: searchRegex },
        { firstName: searchRegex },
        { lastName: searchRegex }
      ]
    });

    res.json({
      success: true,
      users,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: users.length,
        totalUsers: total
      }
    });

  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const uploadprofileImage = async (req, res) => {
  try {
    // Get the user from DB
    const user = await User.findById(req.params.id).select('profileImage');
    if (!user) {
      return res.status(404).json(new ApiResponse(404, null, "User not found"));
    }

    // Check if file is present
    let profileImageLocalPath;
    if (
      req.files &&
      Array.isArray(req.files.profileImage) &&
      req.files.profileImage.length > 0
    ) {
      profileImageLocalPath = req.files.profileImage[0].path;
    } else {
      return res.status(400).json(new ApiResponse(400, null, "No profile image uploaded"));
    }

    // Upload to Cloudinary
    const profileImageUrl = await uploadOnCloudinary(profileImageLocalPath);
    if (!profileImageUrl) {
      return res.status(500).json(new ApiResponse(500, null, "Cloudinary upload failed"));
    }

    // Update and save user
    user.profileImage = profileImageUrl;
    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, user, "Profile image uploaded successfully"));
  } catch (error) {
    console.error("Error uploading profile image:", error);
    return res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
  }
};

const updateUserAvatar = async(req, res) => { 
    const profileImageLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new apierrors(400, "Avatar file is missing")
    }

    const profileImage = await uploadOnCloudinary(profileImageLocalPath)

    if (!avatar.url) {
        throw new apierrors(400, "Error while uploading on avatar")
        
    }

    const profileImageToDelete = user.profileImage.public_id;
    
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar: avatar.url
            }
        },
        {new: true}
    ).select("-password")

    if (avatarToDelete && updatedUser.avatar.public_id) {
        await deleteOnCloudinary(avatarToDelete);
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Profile image updated successfully")
    )
}

export {
  getAllUsers,
  getUserById,
  updateUserProfile,
  deleteUser,
  toggleUserStatus,
  searchUsers,
  uploadprofileImage,
  updateUserAvatar
};