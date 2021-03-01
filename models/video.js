const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const videoSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  isStarred: {
    type: Boolean,
    required: true,
    default: false,
  },
  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Tag',
    },
  ],
});

module.exports = mongoose.model('Video', videoSchema);
