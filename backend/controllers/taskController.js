const Task = require('../models/Task');
const { PRIORITIES } = require('../models/Task');
const { AppError } = require('../middleware/errorHandler');

const sendSuccess = (res, statusCode, data, message) => {
  res.status(statusCode).json({
    success: true,
    data,
    message,
  });
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Validate task input fields for create and update requests.
 * Returns sanitized update object or throws an AppError(400).
 */
const validateTaskPayload = (body, { isUpdate = false } = {}) => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new AppError('Request body must be a JSON object', 400);
  }

  const payload = {};

  if (!isUpdate || Object.prototype.hasOwnProperty.call(body, 'title')) {
    if (typeof body.title !== 'string' || body.title.trim().length === 0) {
      throw new AppError('Task title is required and must be a non-empty string', 400);
    }
    const trimmedTitle = body.title.trim();
    if (trimmedTitle.length > 120) {
      throw new AppError('Task title cannot exceed 120 characters', 400);
    }
    payload.title = trimmedTitle;
  }

  if (Object.prototype.hasOwnProperty.call(body, 'description')) {
    if (body.description !== undefined && body.description !== null && typeof body.description !== 'string') {
      throw new AppError('Description must be a string', 400);
    }
    const trimmedDesc = (body.description ?? '').trim();
    if (trimmedDesc.length > 500) {
      throw new AppError('Description cannot exceed 500 characters', 400);
    }
    payload.description = trimmedDesc;
  }

  if (Object.prototype.hasOwnProperty.call(body, 'completed')) {
    if (typeof body.completed !== 'boolean') {
      throw new AppError('Completed must be a boolean', 400);
    }
    payload.completed = body.completed;
  }

  if (Object.prototype.hasOwnProperty.call(body, 'priority')) {
    if (typeof body.priority !== 'string' || !PRIORITIES.includes(body.priority)) {
      throw new AppError(`Priority must be one of: ${PRIORITIES.join(', ')}`, 400);
    }
    payload.priority = body.priority;
  }

  if (isUpdate && Object.keys(payload).length === 0) {
    throw new AppError('Provide at least one valid field to update (title, description, completed, priority)', 400);
  }

  return payload;
};

/**
 * GET /api/tasks
 * List all tasks, with optional ?status=all|active|completed, ?priority=low|medium|high, and ?search=... filters.
 */
const getTasks = async (req, res, next) => {
  try {
    const { status, priority, search } = req.query;
    const filter = {};

    if (status === 'active') {
      filter.completed = false;
    } else if (status === 'completed') {
      filter.completed = true;
    } else if (status && status !== 'all') {
      throw new AppError('Invalid status filter. Use all, active, or completed', 400);
    }

    if (priority) {
      if (!PRIORITIES.includes(priority)) {
        throw new AppError(`Invalid priority filter. Use one of: ${PRIORITIES.join(', ')}`, 400);
      }
      filter.priority = priority;
    }

    if (typeof search === 'string' && search.trim().length > 0) {
      const regex = new RegExp(escapeRegex(search.trim()), 'i');
      filter.$or = [{ title: regex }, { description: regex }];
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    sendSuccess(res, 200, tasks, 'Tasks retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/tasks/:id
 * Get a single task by ID.
 */
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      throw new AppError('Task not found', 404);
    }
    sendSuccess(res, 200, task, 'Task retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/tasks
 * Create a new task.
 */
const createTask = async (req, res, next) => {
  try {
    const payload = validateTaskPayload(req.body, { isUpdate: false });
    const task = await Task.create(payload);
    sendSuccess(res, 201, task, 'Task created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/tasks/:id
 * Update an existing task (title, description, completed, priority).
 */
const updateTask = async (req, res, next) => {
  try {
    const payload = validateTaskPayload(req.body, { isUpdate: true });
    const task = await Task.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    sendSuccess(res, 200, task, 'Task updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/tasks/:id/toggle
 * Toggle completion status of a task.
 */
const toggleTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      throw new AppError('Task not found', 404);
    }

    task.completed = !task.completed;
    await task.save();

    const statusText = task.completed ? 'completed' : 'active';
    sendSuccess(res, 200, task, `Task marked as ${statusText}`);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/tasks/:id
 * Delete a single task by ID.
 */
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      throw new AppError('Task not found', 404);
    }

    sendSuccess(res, 200, task, 'Task deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/tasks/completed
 * Remove all completed tasks in a single operation.
 */
const clearCompletedTasks = async (req, res, next) => {
  try {
    const result = await Task.deleteMany({ completed: true });
    sendSuccess(
      res,
      200,
      { deletedCount: result.deletedCount },
      result.deletedCount > 0
        ? `Cleared ${result.deletedCount} completed ${result.deletedCount === 1 ? 'task' : 'tasks'}`
        : 'No completed tasks to clear'
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  toggleTask,
  deleteTask,
  clearCompletedTasks,
};

