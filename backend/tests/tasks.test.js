const { describe, it, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

process.env.NODE_ENV = 'test';

const app = require('../server');
const Task = require('../models/Task');

let mongoServer;
let server;
let baseUrl;

const requestJson = async (path, options = {}) => {
  const res = await fetch(`${baseUrl}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const body = await res.json();
  return { status: res.status, body };
};

describe('Task List REST API', () => {
  before(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, resolve));
    const { port } = server.address();
    baseUrl = `http://127.0.0.1:${port}`;
  });

  after(async () => {
    await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();
    if (server) await new Promise((resolve) => server.close(resolve));
  });

  beforeEach(async () => {
    await Task.deleteMany({});
  });

  it('GET /api/health returns 200 ok', async () => {
    const { status, body } = await requestJson('/api/health');
    assert.equal(status, 200);
    assert.equal(body.success, true);
    assert.equal(body.data.status, 'ok');
  });

  it('POST /api/tasks creates a task and returns 201', async () => {
    const { status, body } = await requestJson('/api/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title: '  Ship Android Club Challenge  ',
        description: '  Verify CRUD endpoints  ',
        priority: 'high',
      }),
    });

    assert.equal(status, 201);
    assert.equal(body.success, true);
    assert.equal(body.data.title, 'Ship Android Club Challenge');
    assert.equal(body.data.description, 'Verify CRUD endpoints');
    assert.equal(body.data.priority, 'high');
    assert.equal(body.data.completed, false);
    assert.ok(body.data._id);
    assert.ok(body.data.createdAt);
  });

  it('POST /api/tasks returns 400 for missing or blank title', async () => {
    const { status, body } = await requestJson('/api/tasks', {
      method: 'POST',
      body: JSON.stringify({ title: '   ', priority: 'low' }),
    });

    assert.equal(status, 400);
    assert.equal(body.success, false);
    assert.equal(body.data, null);
    assert.match(body.message, /title/i);
  });

  it('POST /api/tasks returns 400 for invalid priority', async () => {
    const { status, body } = await requestJson('/api/tasks', {
      method: 'POST',
      body: JSON.stringify({ title: 'Test task', priority: 'urgent' }),
    });

    assert.equal(status, 400);
    assert.equal(body.success, false);
  });

  it('GET /api/tasks returns tasks sorted newest-first and supports filtering', async () => {
    await Task.create({ title: 'Active task', completed: false, priority: 'low' });
    await Task.create({ title: 'Done task', completed: true, priority: 'high' });

    const allRes = await requestJson('/api/tasks');
    assert.equal(allRes.status, 200);
    assert.equal(allRes.body.data.length, 2);

    const activeRes = await requestJson('/api/tasks?status=active');
    assert.equal(activeRes.status, 200);
    assert.equal(activeRes.body.data.length, 1);
    assert.equal(activeRes.body.data[0].title, 'Active task');

    const completedRes = await requestJson('/api/tasks?status=completed');
    assert.equal(completedRes.status, 200);
    assert.equal(completedRes.body.data.length, 1);
    assert.equal(completedRes.body.data[0].title, 'Done task');
  });

  it('GET /api/tasks/:id returns 400 on invalid ObjectId and 404 when missing', async () => {
    const invalidRes = await requestJson('/api/tasks/not-a-valid-id');
    assert.equal(invalidRes.status, 400);
    assert.equal(invalidRes.body.success, false);

    const missingId = new mongoose.Types.ObjectId().toString();
    const missingRes = await requestJson(`/api/tasks/${missingId}`);
    assert.equal(missingRes.status, 404);
    assert.equal(missingRes.body.success, false);
  });

  it('PUT /api/tasks/:id updates title, description, completed, and priority', async () => {
    const created = await Task.create({ title: 'Initial', priority: 'low' });

    const { status, body } = await requestJson(`/api/tasks/${created._id}`, {
      method: 'PUT',
      body: JSON.stringify({
        title: 'Updated Title',
        description: 'Added details',
        completed: true,
        priority: 'high',
      }),
    });

    assert.equal(status, 200);
    assert.equal(body.success, true);
    assert.equal(body.data.title, 'Updated Title');
    assert.equal(body.data.description, 'Added details');
    assert.equal(body.data.completed, true);
    assert.equal(body.data.priority, 'high');
  });

  it('PATCH /api/tasks/:id/toggle flips completion state', async () => {
    const created = await Task.create({ title: 'Toggle me', completed: false });

    const first = await requestJson(`/api/tasks/${created._id}/toggle`, {
      method: 'PATCH',
    });
    assert.equal(first.status, 200);
    assert.equal(first.body.data.completed, true);

    const second = await requestJson(`/api/tasks/${created._id}/toggle`, {
      method: 'PATCH',
    });
    assert.equal(second.status, 200);
    assert.equal(second.body.data.completed, false);
  });

  it('DELETE /api/tasks/:id deletes task and returns 404 afterwards', async () => {
    const created = await Task.create({ title: 'Delete me' });

    const delRes = await requestJson(`/api/tasks/${created._id}`, {
      method: 'DELETE',
    });
    assert.equal(delRes.status, 200);
    assert.equal(delRes.body.success, true);

    const getRes = await requestJson(`/api/tasks/${created._id}`);
    assert.equal(getRes.status, 404);
  });

  it('DELETE /api/tasks/completed removes only completed tasks', async () => {
    await Task.create([
      { title: 'Keep active', completed: false },
      { title: 'Clear one', completed: true },
      { title: 'Clear two', completed: true },
    ]);

    const res = await requestJson('/api/tasks/completed', { method: 'DELETE' });
    assert.equal(res.status, 200);
    assert.equal(res.body.data.deletedCount, 2);

    const remaining = await Task.find();
    assert.equal(remaining.length, 1);
    assert.equal(remaining[0].title, 'Keep active');
  });

  it('Unknown routes return 404 in standard JSON format', async () => {
    const { status, body } = await requestJson('/api/does-not-exist');
    assert.equal(status, 404);
    assert.equal(body.success, false);
    assert.equal(body.data, null);
    assert.match(body.message, /Route not found/i);
  });
});

