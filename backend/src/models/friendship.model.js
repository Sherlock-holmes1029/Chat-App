import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const friendshipSchema = new Schema({
  user1: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  user2: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Unique compound index
friendshipSchema.index({ user1: 1, user2: 1 }, { unique: true });


const Friendship = model('Friendship', friendshipSchema);
export default Friendship;