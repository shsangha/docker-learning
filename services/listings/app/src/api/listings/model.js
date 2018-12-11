const mongoose = require('mongoose');

const { Schema } = mongoose;

const CommentSchema = new Schema({
  sender: {
    type: String,
    required: [true, 'sender is required']
  },
  content: {
    type: String,
    required: [true, 'cant send an empty message']
  }
});

const ListingSchmea = new Schema({
  seller: {
    type: String,
    required: [true, 'seller is required']
  },
  posted: {
    type: Date,
    required: [true, 'date is required']
  },
  market: {
    type: String,
    enum: ['grailed', 'core', 'sartorial', 'hype'],
    required: [true, 'market is required']
  },
  category: {
    type: String,
    required: [true, 'category is required']
  },
  likes: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    required: [true, 'decription is required']
  },
  photos: {
    type: [String],
    required: [true, 'must provide atleast one photo']
  },
  title: {
    type: String,
    required: [true, 'title is required']
  },
  designer: {
    type: String,
    required: true
  },
  accept_offers: {
    type: Boolean,
    required: [true, 'accept_offers is required']
  },
  sold: {
    type: Boolean,
    required: true
  },
  comments: [CommentSchema],
  shipping: [
    {
      country: {
        type: String,
        required: [true, 'country is required']
      },
      price: {
        type: Number,
        required: [true, 'price is required'],
        min: 0
      }
    }
  ]
});
