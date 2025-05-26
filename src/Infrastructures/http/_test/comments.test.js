const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

const preaddedComment = {
  id: 'comment-123456',
  threadId: 'thread-123',
  userId: 'user-456',
};

describe('/threads/{threadId}/comments endpoint', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
    await UsersTableTestHelper.addUser({ id: 'user-456', username: 'user2' });
  });

  beforeEach(async () => {
    await CommentsTableTestHelper.addComment({ ...preaddedComment });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('when POST /comments', () => {
    it('should respond with 201 and comment persists', async () => {
      const requestPayload = { content: 'isi komentar' };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        auth: {
          strategy: 'forum_jwt',
          credentials: { id: 'user-456' },
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it('should return correct response body', async () => {
      const requestPayload = { content: 'isi komentar' };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        auth: {
          strategy: 'forum_jwt',
          credentials: { id: 'user-456' },
        },
      });

      const responseJson = JSON.parse(response.payload);
      const { id, content, owner } = responseJson.data.addedComment;
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(id).toContain('comment-');
      expect(content).toEqual('isi komentar');
      expect(owner).toEqual('user-456');
    });

    it('should respond with 401 when request not authenticated', async () => {
      const requestPayload = { content: 'isi komentar' };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should respond with 404 when thread not found', async () => {
      const requestPayload = { content: 'isi komentar' };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-nonexistent/comments',
        payload: requestPayload,
        auth: {
          strategy: 'forum_jwt',
          credentials: { id: 'user-456' },
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should respond with 400 when payload not contain required property', async () => {
      const requestPayload = {};

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        auth: {
          strategy: 'forum_jwt',
          credentials: { id: 'user-456' },
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('gagal memposting komentar karena komentar tidak boleh kosong');
    });

    it('should respond with 400 when payload not meet data type specification', async () => {
      const requestPayload = { content: 123 };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        auth: {
          strategy: 'forum_jwt',
          credentials: { id: 'user-456' },
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('gagal memposting komentar karena komentar tidak berupa string');
    });
  });

  describe('when DELETE /comments/{commentId}', () => {
    it('should respond with 200 when deleting valid own comment', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${preaddedComment.threadId}/comments/${preaddedComment.id}`,
        auth: {
          strategy: 'forum_jwt',
          credentials: { id: preaddedComment.userId },
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
        url: `/threads/${preaddedComment.threadId}/comments/${preaddedComment.id}`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should respond with 403 when deleting other\'s comment', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${preaddedComment.threadId}/comments/${preaddedComment.id}`,
        auth: {
          strategy: 'forum_jwt',
          credentials: { id: 'user-123' },
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Anda bukan pemilik komentar ini');
    });

    it('should respond with 404 when deleting not found comment', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${preaddedComment.threadId}/comments/comment-nonexistent`,
        auth: {
          strategy: 'forum_jwt',
          credentials: { id: preaddedComment.userId },
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
        url: `/threads/thread-nonexistent/comments/${preaddedComment.id}`,
        auth: {
          strategy: 'forum_jwt',
          credentials: { id: preaddedComment.userId },
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
        url: `/threads/${preaddedComment.threadId}/comments/${preaddedComment.id}`,
        auth: {
          strategy: 'forum_jwt',
          credentials: {},
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('gagal menghapus komentar karena data yang dibutuhkan tidak lengkap');
    });

    it('should respond with 400 when payload not meet data type specification', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${preaddedComment.threadId}/comments/${preaddedComment.id}`,
        auth: {
          strategy: 'forum_jwt',
          credentials: { id: 123 },
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('gagal menghapus komentar karena tipe data tidak sesuai');
    });
  });
});
