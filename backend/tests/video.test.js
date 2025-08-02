const request = require('supertest');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const app = require('../src/app');
const User = require('../src/models/User');
const Video = require('../src/models/Video');
const VideoAnalysis = require('../src/models/VideoAnalysis');

describe('Video API Tests', () => {
  let authToken;
  let testUser;
  let testVideo;

  beforeAll(async () => {
    // Create test user
    testUser = new User({
      email: 'test@video.com',
      password: 'password123',
      profile: {
        firstName: 'Test',
        lastName: 'User'
      },
      role: 'Farmer'
    });
    await testUser.save();

    // Login to get token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@video.com',
        password: 'password123'
      });

    authToken = loginResponse.body.token;
  });

  afterAll(async () => {
    // Cleanup
    await User.deleteMany({ email: 'test@video.com' });
    await Video.deleteMany({ userId: testUser._id });
    await VideoAnalysis.deleteMany({ userId: testUser._id });
    await mongoose.connection.close();
  });

  describe('GET /api/videos/test', () => {
    it('should test Gemini API connection', async () => {
      const response = await request(app)
        .get('/api/videos/test')
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('success');
      expect(typeof response.body.success).toBe('boolean');
    });
  });

  describe('GET /api/videos', () => {
    it('should return user videos when authenticated', async () => {
      const response = await request(app)
        .get('/api/videos')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('videos');
      expect(Array.isArray(response.body.videos)).toBe(true);
      expect(response.body).toHaveProperty('pagination');
    });

    it('should return 401 when not authenticated', async () => {
      await request(app)
        .get('/api/videos')
        .expect(401);
    });
  });

  describe('POST /api/videos/upload', () => {
    it('should return 400 when no file is uploaded', async () => {
      const response = await request(app)
        .post('/api/videos/upload')
        .set('Authorization', `Bearer ${authToken}`)
        .field('title', 'Test Video')
        .field('description', 'Test Description')
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('No video file uploaded');
    });

    it('should return 400 when invalid file type is uploaded', async () => {
      const response = await request(app)
        .post('/api/videos/upload')
        .set('Authorization', `Bearer ${authToken}`)
        .field('title', 'Test Video')
        .field('description', 'Test Description')
        .attach('video', Buffer.from('fake video content'), 'test.txt')
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/videos/:id/analyze', () => {
    beforeEach(async () => {
      // Create a test video
      testVideo = new Video({
        userId: testUser._id,
        title: 'Test Video',
        description: 'Test Description',
        filename: 'test-video.mp4',
        fileUrl: '/uploads/videos/test-video.mp4',
        fileSize: 1024,
        mimeType: 'video/mp4',
        status: 'completed'
      });
      await testVideo.save();
    });

    afterEach(async () => {
      if (testVideo._id) {
        await Video.findByIdAndDelete(testVideo._id);
      }
    });

    it('should return 404 for non-existent video', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app)
        .post(`/api/videos/${fakeId}/analyze`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          prompt: 'What do you see in this video?',
          analysisType: 'question'
        })
        .expect(404);
    });

    it('should return 400 for invalid prompt', async () => {
      const response = await request(app)
        .post(`/api/videos/${testVideo._id}/analyze`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          prompt: '',
          analysisType: 'question'
        })
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });

    it('should return 400 for invalid analysis type', async () => {
      const response = await request(app)
        .post(`/api/videos/${testVideo._id}/analyze`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          prompt: 'What do you see?',
          analysisType: 'invalid_type'
        })
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('GET /api/videos/:id/history', () => {
    beforeEach(async () => {
      // Create a test video
      testVideo = new Video({
        userId: testUser._id,
        title: 'Test Video',
        description: 'Test Description',
        filename: 'test-video.mp4',
        fileUrl: '/uploads/videos/test-video.mp4',
        fileSize: 1024,
        mimeType: 'video/mp4',
        status: 'completed'
      });
      await testVideo.save();
    });

    afterEach(async () => {
      if (testVideo._id) {
        await Video.findByIdAndDelete(testVideo._id);
      }
    });

    it('should return 404 for non-existent video', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app)
        .get(`/api/videos/${fakeId}/history`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return analysis history for valid video', async () => {
      const response = await request(app)
        .get(`/api/videos/${testVideo._id}/history`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('analyses');
      expect(Array.isArray(response.body.analyses)).toBe(true);
    });
  });

  describe('DELETE /api/videos/:id', () => {
    beforeEach(async () => {
      // Create a test video
      testVideo = new Video({
        userId: testUser._id,
        title: 'Test Video',
        description: 'Test Description',
        filename: 'test-video.mp4',
        fileUrl: '/uploads/videos/test-video.mp4',
        fileSize: 1024,
        mimeType: 'video/mp4',
        status: 'completed'
      });
      await testVideo.save();
    });

    it('should return 404 for non-existent video', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app)
        .delete(`/api/videos/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should delete video successfully', async () => {
      await request(app)
        .delete(`/api/videos/${testVideo._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify video is deleted
      const deletedVideo = await Video.findById(testVideo._id);
      expect(deletedVideo).toBeNull();
    });
  });
}); 