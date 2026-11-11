const express = require('express');
const validateObjectId = require('../middleware/validateObjectId');
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  toggleTask,
  deleteTask,
  clearCompletedTasks,
} = require('../controllers/taskController');

const router = express.Router();

router.route('/').get(getTasks).post(createTask);

// Must be registered before /:id so "completed" is not treated as an ObjectId.
router.delete('/completed', clearCompletedTasks);

router
  .route('/:id')
  .get(validateObjectId, getTaskById)
  .put(validateObjectId, updateTask)
  .delete(validateObjectId, deleteTask);

router.patch('/:id/toggle', validateObjectId, toggleTask);

module.exports = router;

