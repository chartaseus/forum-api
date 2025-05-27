const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  const userId = 'user-1';
  beforeAll(async () => {
    // console.log('adding a test user...');
    await UsersTableTestHelper.addUser({
      id: userId,
      username: 'threadstesthelper',
      password: 'test',
      fullname: 'threads plugin test helper',
    });
  });

  afterEach(async () => {
    // console.log('cleaning threads table...');
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    // console.log('cleaning users table...');
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('when POST /threads', () => {
    it('should respond with 201 and thread persists', async () => {
      const requestPayload = {
        title: 'my first thread',
        body: 'Halo!',
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        auth: {
          strategy: 'forum_jwt',
          credentials: { id: 'user-1' },
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it('should respond with 401 when request not authenticated', async () => {
      const requestPayload = {
        title: 'my first thread',
        body: 'Halo!',
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should respond with 400 when payload does not contain required property', async () => {
      const requestPayload = { body: 'Halo!' };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        auth: {
          strategy: 'forum_jwt',
          credentials: { id: 'user-1' },
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('gagal memposting thread karena judul atau badan thread kosong');
    });

    it('should respond with 400 when payload does not meet data type specification', async () => {
      const requestPayload = {
        title: 1,
        body: 'Halo!',
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        auth: {
          strategy: 'forum_jwt',
          credentials: { id: 'user-1' },
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('gagal memposting thread karena judul atau badan thread tidak berupa string');
    });

    // maybe no need to test userId since it comes from database via auth strategy?
    // it('should respond with 400 when userId exceeds 50 characters')
  });

  describe('when GET /threads/{threadId}', () => {
    const threadId = 'thread-getthreadtest';

    beforeEach(async () => {
      // console.log('adding a test thread...');
      await ThreadsTableTestHelper.addThread({ id: threadId, userId });
      // console.log('adding comments to test thread...');
      await CommentsTableTestHelper.addComment({ id: 'comment-first', threadId, userId });
      await CommentsTableTestHelper.addComment({ id: 'comment-second', threadId, userId });
    });

    afterEach(async () => {
      // console.log('cleaning comments table...');
      await CommentsTableTestHelper.cleanTable();
    });

    it('should respond with 200 and return correct thread data', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toMatchObject({
        id: threadId,
        title: 'test',
        body: 'test helper',
        username: 'threadstesthelper',
      });
      expect(responseJson.data.thread.date).toBeDefined();
      expect(responseJson.data.thread.comments).toBeDefined();
    });

    it('should respond with 404 when thread not found or invalid', async () => {
      const notFoundThreadId = 'xxx';
      const server = await createServer(container);

      const response = await server.inject({
        method: 'GET',
        url: `/threads/${notFoundThreadId}`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should return all thread comments in ascending order', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      const comments = JSON.parse(response.payload).data.thread.comments;
      expect(comments).toHaveLength(2);

      const [comment1, comment2] = comments;
      expect(comment1.id).toEqual('comment-first');
      expect(comment2.id).toEqual('comment-second');
    });

    it('should return deleted comment content as "**komentar telah dihapus**"', async () => {
      await CommentsTableTestHelper.addDeletedComment({ id: 'comment-third', userId, threadId });
      const server = await createServer(container);

      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      const comments = JSON.parse(response.payload).data.thread.comments;
      expect(comments).toHaveLength(3);
      expect(comments[2].content).toEqual('**komentar telah dihapus**');
    });
  });
});
