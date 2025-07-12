import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'shirts', 'pants', 'dresses', 'skirts', 'jackets', 'coats', 
      'shoes', 'accessories', 'jewelry', 'bags', 'hats', 'scarves',
      'sports', 'formal', 'casual', 'vintage', 'other'
    ]
  },
  size: {
    type: String,
    required: [true, 'Size is required'],
    enum: [
      'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL',
      '2', '4', '6', '8', '10', '12', '14', '16', '18', '20',
      '22', '24', '26', '28', '30', '32', '34', '36', '38', '40',
      '42', '44', '46', '48', '50', '52', '54', '56', '58', '60',
      'One Size', 'Custom'
    ]
  },
  condition: {
    type: String,
    required: [true, 'Condition is required'],
    enum: ['new', 'like-new', 'good', 'fair', 'poor']
  },
  brand: {
    type: String,
    trim: true,
    maxlength: [50, 'Brand cannot exceed 50 characters'],
    default: 'Unknown'
  },
  color: {
    type: String,
    required: [true, 'Color is required'],
    trim: true,
    maxlength: [30, 'Color cannot exceed 30 characters']
  },
  material: {
    type: String,
    trim: true,
    maxlength: [100, 'Material cannot exceed 100 characters'],
    default: 'Unknown'
  },
  images: [{
    type: String,
    required: [true, 'At least one image is required']
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'reserved', 'exchanged', 'removed'],
    default: 'available'
  },
  exchangeType: {
    type: String,
    enum: ['giveaway', 'trade', 'sale'],
    required: [true, 'Exchange type is required']
  },
  points: {
    type: Number,
    min: [0, 'Price cannot be negative'],
    default: 0
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [20, 'Tag cannot exceed 20 characters']
  }],
  views: {
    type: Number,
    default: 0
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  interestedUsers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: {
      type: String,
      maxlength: [500, 'Message cannot exceed 500 characters']
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  exchangeHistory: [{
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    date: {
      type: Date,
      default: Date.now
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters']
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

itemSchema.index({
  title: 'text',
  description: 'text',
  brand: 'text',
  tags: 'text'
});

itemSchema.virtual('favoriteCount').get(function() {
  return this.favorites.length;
});

itemSchema.virtual('interestedCount').get(function() {
  return this.interestedUsers.length;
});

itemSchema.set('toJSON', { virtuals: true });
itemSchema.set('toObject', { virtuals: true });

const Item = mongoose.model('Item', itemSchema);

export default Item; 