const mongoose = require('mongoose');

const PRIORITIES = ['low', 'medium', 'high'];

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [1, 'Task title cannot be empty'],
      maxlength: [120, 'Task title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: {
        values: PRIORITIES,
        message: 'Priority must be one of: low, medium, high',
      },
      default: 'medium',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

taskSchema.index({ completed: 1, createdAt: -1 });

module.exports = mongoose.model('Task', taskSchema);
module.exports.PRIORITIES = PRIORITIES;

