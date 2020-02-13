const mongoose = require('mongoose');
const { MARKETS, SELLER_LOCATIONS, CATEGORIES } = require('./Constants');

const { Schema } = mongoose;

const ListingSchema = new Schema({
  seller: {
    type: String,
    required: [true, 'Must Provide Seller ID']
  },
  name: {
    type: String,
    required: [true, 'Name is a required field']
  },
  designer: {
    // might make this an enum still debating is that makes sense
    type: String,
    required: [true, 'Designer is a required field']
  },
  catgeory: {
    type: String,
    enum: CATEGORIES,
    required: [true, 'Category is a required field']
  },
  market: {
    type: String,
    enum: MARKETS,
    required: [true, 'Markets is a required field']
  },
  // might look into an enum here too
  size: {
    type: String,
    required: [true, 'Size is a required field']
  },
  price: {
    type: [Number],
    required: [true, 'Price is a required field']
  },
  seller_location: {
    type: String,
    enum: SELLER_LOCATIONS,
    required: [true, 'Seller location is a required field']
  },
  description: {
    type: String,
    required: [true, 'Must proivide a desription']
  },
  posted: {
    type: Date,
    default: Date.now
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  accept_offers: {
    type: Boolean,
    default: false
  },
  buy_now_options: [{ location: String, price: Number }]
});

module.exports = mongoose.model('Listing', ListingSchema);
