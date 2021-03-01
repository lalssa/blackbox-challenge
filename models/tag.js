const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tagSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  videos: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Video',
    },
  ],
});

module.exports = mongoose.model('Tag', tagSchema);
