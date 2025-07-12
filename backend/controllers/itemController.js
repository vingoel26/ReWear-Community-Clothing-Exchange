import Item from '../models/Item.js';
import User from '../models/User.js';
import { validationResult } from 'express-validator';

const createItem = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const itemData = {
      ...req.body,
      owner: req.user.userId
    };

    const item = new Item(itemData);
    await item.save();

    await User.findByIdAndUpdate(req.user.userId, {
      $push: { itemsPosted: item._id }
    });

    await item.populate('owner', 'username firstName lastName');

    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      item
    });

  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const getAllItems = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      size,
      condition,
      exchangeType,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (page - 1) * limit;
    const filter = { status: 'available', isActive: true };

    if (category) filter.category = category;
    if (size) filter.size = size;
    if (condition) filter.condition = condition;
    if (exchangeType) filter.exchangeType = exchangeType;

    if (search) {
      filter.$text = { $search: search };
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const items = await Item.find(filter)
      .populate('owner', 'username firstName lastName location')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Item.countDocuments(filter);

    res.json({
      success: true,
      items,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: items.length,
        totalItems: total
      }
    });

  } catch (error) {
    console.error('Get all items error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('owner', 'username firstName lastName location bio')
      .populate('favorites', 'username')
      .populate('interestedUsers.user', 'username firstName lastName');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    item.views += 1;
    await item.save();

    res.json({
      success: true,
      item
    });

  } catch (error) {
    console.error('Get item by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const updateItem = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    if (item.owner.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this item'
      });
    }

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('owner', 'username firstName lastName');

    res.json({
      success: true,
      message: 'Item updated successfully',
      item: updatedItem
    });

  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    if (item.owner.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this item'
      });
    }

    await Item.findByIdAndDelete(req.params.id);

    await User.findByIdAndUpdate(req.user.userId, {
      $pull: { itemsPosted: req.params.id }
    });

    res.json({
      success: true,
      message: 'Item deleted successfully'
    });

  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const toggleFavorite = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    const userId = req.user.userId;
    const isFavorited = item.favorites.includes(userId);

    if (isFavorited) {
      item.favorites = item.favorites.filter(id => id.toString() !== userId);
      await User.findByIdAndUpdate(userId, {
        $pull: { favorites: req.params.id }
      });
    } else {
      item.favorites.push(userId);
      await User.findByIdAndUpdate(userId, {
        $push: { favorites: req.params.id }
      });
    }

    await item.save();

    res.json({
      success: true,
      message: isFavorited ? 'Removed from favorites' : 'Added to favorites',
      isFavorited: !isFavorited
    });

  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const expressInterest = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { message } = req.body;
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    const existingInterest = item.interestedUsers.find(
      interest => interest.user.toString() === req.user.userId
    );

    if (existingInterest) {
      return res.status(400).json({
        success: false,
        message: 'You have already expressed interest in this item'
      });
    }

    item.interestedUsers.push({
      user: req.user.userId,
      message: message || ''
    });

    await item.save();

    res.json({
      success: true,
      message: 'Interest expressed successfully'
    });

  } catch (error) {
    console.error('Express interest error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const getUserItems = async (req, res) => {
  try {
    const { userId } = req.params;
    const { type = 'posted', page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let items;
    let total;

    switch (type) {
      case 'posted':
        items = await Item.find({ owner: userId, isActive: true })
          .populate('owner', 'username firstName lastName')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit));
        total = await Item.countDocuments({ owner: userId, isActive: true });
        break;
      case 'favorites':
        const user = await User.findById(userId).populate('favorites');
        items = user.favorites;
        total = user.favorites.length;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid type parameter'
        });
    }

    res.json({
      success: true,
      items,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: items.length,
        totalItems: total
      }
    });

  } catch (error) {
    console.error('Get user items error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const uploadItemImages = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json(new ApiResponse(404, null, 'Item not found'));
    }

    if (item.owner.toString() !== req.user.userId) {
      return res.status(403).json(new ApiResponse(403, null, 'Not authorized'));
    }

    const files = req.files?.itemImages || [];

    // ❌ If no new images AND no existing images => reject
    if (files.length === 0 && item.images.length === 0) {
      return res.status(400).json(
        new ApiResponse(400, null, 'At least one image is required')
      );
    }

    // ✅ Upload any newly uploaded images
    const uploadResults = await Promise.all(
      files.map(file => uploadOnCloudinary(file.path))
    );

    const validUrls = uploadResults.filter(Boolean);
    if (validUrls.length > 0) {
      item.images.push(...validUrls); // Add new ones
    }

    await item.save();

    return res
      .status(200)
      .json(new ApiResponse(200, item, 'Images uploaded successfully'));
  } catch (error) {
    console.error('Upload item images error:', error);
    return res.status(500).json(new ApiResponse(500, null, 'Server error'));
  }
};



export {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
  toggleFavorite,
  expressInterest,
  getUserItems
}; 