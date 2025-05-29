const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments/{commentId}/replies endpoint', () => {
  const replyId = 'reply-123';
  const commentId = 'comment-123';
  const threadId = 'thread-123';
  const userId = 'user-123';
  const secondUserId = 'user-456';

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: userId });
    await UsersTableTestHelper.addUser({ id: secondUserId, username: 'seconduser' });
    await ThreadsTableTestHelper.addThread({ id: threadId, userId });
    await CommentsTableTestHelper.addComment({ id: commentId, threadId, userId });
  });

  beforeEach(async () => {
    await RepliesTableTestHelper.addReply({ id: replyId });
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('when POST /replies', () => {
    it('should respond with 201 and reply persists', async () => {
      const requestPayload = { content: 'isi balasan' };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        auth: {
          strategy: 'forum_jwt',
          credentials: { id: secondUserId },
        },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
    });

    it('should return correct response body', async () => {
      const requestPayload = { content: 'isi balasan' };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        auth: {
          strategy: 'forum_jwt',
          credentials: { id: secondUserId },
        },
      });

      const responseJson = JSON.parse(response.payload);
      const { id, content, owner } = responseJson.data.addedReply;

      expect(id).toContain('reply-');
      expect(content).toEqual('isi balasan');
      expect(owner).toEqual(secondUserId);
    });

    it('should respond with 401 when request not authenticated', async () => {
      const requestPayload = { content: 'isi balasan' };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should respond with 404 when thread not found', async () => {
      const requestPayload = { content: 'isi balasan' };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: `/threads/thread-nonexistent/comments/${commentId}/replies`,
        payload: requestPayload,
        auth: {
          strategy: 'forum_jwt',
          credentials: { id: secondUserId },
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should respond with 404 when cooment not found', async () => {
      const requestPayload = { content: 'isi balasan' };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/comment-nonexistent/replies`,
        payload: requestPayload,
        auth: {
          strategy: 'forum_jwt',
          credentials: { id: secondUserId },
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('komentar tidak ditemukan');
    });

    it('should respond with 400 when payload not contain required property', async () => {
      const requestPayload = {};

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        auth: {
          strategy: 'forum_jwt',
          credentials: { id: secondUserId },
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('gagal memposting balasan karena balasan tidak boleh kosong');
    });

    it('should respond with 400 when payload not meet data type specification', async () => {
      const requestPayload = { content: 123 };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        auth: {
          strategy: 'forum_jwt',
          credentials: { id: secondUserId },
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('gagal memposting balasan karena balasan tidak berupa string');
    });
  });

  describe('when DELETE /replies/{repliesId}', () => {
    it('should respond with 200 when deleting valid own reply', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        auth: {
          strategy: 'forum_jwt',
          credentials: { id: userId },
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should respond with 401 when deleting without authentication', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should respond with 403 when deleting other\'s reply', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        auth: {
          strategy: 'forum_jwt',
          credentials: { id: secondUserId },
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Anda bukan pemilik balasan ini');
    });

    it('should respond with 404 when deleting not found reply', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/reply-nonexistent`,
        auth: {
          strategy: 'forum_jwt',
          credentials: { id: userId },
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('balasan tidak ditemukan');
    });

    it('should respond with 404 when comment not found', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/comment-nonexistent/replies/${replyId}`,
        auth: {
          strategy: 'forum_jwt',
          credentials: { id: userId },
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('komentar tidak ditemukan');
    });

    it('should respond with 404 when thread not found', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/thread-nonexistent/comments/${commentId}/replies/${replyId}`,
        auth: {
          strategy: 'forum_jwt',
          credentials: { id: userId },
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should respond with 400 when payload not contain required property', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        auth: {
          strategy: 'forum_jwt',
          credentials: {},
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('gagal menghapus balasan karena data yang dibutuhkan tidak lengkap');
    });

    it('should respond with 400 when payload not meet data type specification', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        auth: {
          strategy: 'forum_jwt',
          credentials: { id: 123 },
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('gagal menghapus balasan karena tipe data tidak sesuai');
    });
  });
});
