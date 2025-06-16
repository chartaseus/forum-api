const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  const userId = 'user-1';

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({
      id: userId,
      username: 'threadstesthelper',
      password: 'test',
      fullname: 'threads plugin test helper',
    });
    await UsersTableTestHelper.addUser({});
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
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
  });

  describe('when GET /threads/{threadId}', () => {
    const threadId = 'thread-getthreadtest';
    const firstCommentId = 'comment-first';
    const secondCommentId = 'comment-second';
    const firstReplyId = 'reply-1-1';
    const secondReplyId = 'reply-1-2';
    const thirdReplyId = 'reply-2-1';

    beforeEach(async () => {
      await ThreadsTableTestHelper.addThread({ id: threadId, userId });
      await CommentsTableTestHelper.addComment({ id: firstCommentId, threadId, userId });
      await CommentsTableTestHelper.addComment({ id: secondCommentId, threadId, userId });
      await CommentLikesTableTestHelper.addLike({ commentId: firstCommentId });
      await CommentLikesTableTestHelper.addLike({ commentId: secondCommentId });
      await CommentLikesTableTestHelper.addLike({ commentId: secondCommentId, userId });
      await RepliesTableTestHelper.addReply({ id: firstReplyId, commentId: firstCommentId });
      await RepliesTableTestHelper.addReply({ id: secondReplyId, commentId: firstCommentId });
      await RepliesTableTestHelper.addReply({ id: thirdReplyId, commentId: secondCommentId });
    });

    afterEach(async () => {
      await CommentLikesTableTestHelper.cleanTable();
      await RepliesTableTestHelper.cleanTable();
      await CommentsTableTestHelper.cleanTable();
    });

    it('should respond with 200 and return correct thread data', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      const responseJson = JSON.parse(response.payload);
      const comments = responseJson.data.thread.comments;

      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toEqual({
        id: threadId,
        title: 'test',
        body: 'test helper',
        date: expect.any(String),
        username: 'threadstesthelper',
        comments: expect.any(Array),
      });
      comments.forEach((comment) => {
        expect(comment.replies).toEqual(expect.any(Array));
      });
    });

    it('should respond with 404 when thread not found or invalid', async () => {
      const notFoundThreadId = 'thread-nonexistent';

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
      expect(comment1).toEqual({
        id: firstCommentId,
        content: 'comment test helper',
        username: 'threadstesthelper',
        date: expect.any(String),
        replies: expect.any(Array),
        likeCount: 1,
      });
      expect(comment2).toEqual({
        id: secondCommentId,
        content: 'comment test helper',
        username: 'threadstesthelper',
        date: expect.any(String),
        replies: expect.any(Array),
        likeCount: 2,
      });
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

    it('should return all replies under correct comments in ascending order', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      const [comment1, comment2] = JSON.parse(response.payload).data.thread.comments;
      expect(comment1.replies).toHaveLength(2);
      expect(comment2.replies).toHaveLength(1);

      const [reply1, reply2] = comment1.replies;
      expect(reply1).toEqual({
        id: firstReplyId,
        content: 'reply test helper',
        username: 'dicoding',
        date: expect.any(String),
      });
      expect(reply2).toEqual({
        id: secondReplyId,
        content: 'reply test helper',
        username: 'dicoding',
        date: expect.any(String),
      });

      expect(comment2.replies[0]).toEqual({
        id: thirdReplyId,
        content: 'reply test helper',
        username: 'dicoding',
        date: expect.any(String),
      });
    });

    it('should return deleted replies content as "**balasan telah dihapus**"', async () => {
      await RepliesTableTestHelper.addDeletedReply({
        id: 'reply-deleted',
        commentId: secondCommentId,
      });

      const server = await createServer(container);

      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      const comment2 = JSON.parse(response.payload).data.thread.comments[1];
      expect(comment2.replies).toHaveLength(2);
      expect(comment2.replies[1].content).toEqual('**balasan telah dihapus**');
    });
  });
});
