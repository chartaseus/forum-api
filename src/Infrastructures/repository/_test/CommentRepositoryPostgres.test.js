const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const CommentDetail = require('../../../Domains/comments/entities/CommentDetail');
const PostComment = require('../../../Domains/comments/entities/PostComment');
const PostedComment = require('../../../Domains/comments/entities/PostedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});

    // add a second user
    await UsersTableTestHelper.addUser({
      id: 'user-456',
      username: 'seconduser',
    });
  });

  beforeEach(async () => {
    // add comment by the second user
    await CommentsTableTestHelper.addComment({ userId: 'user-456' });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addComment function', () => {
    it('should add comment persistently', async () => {
      const postComment = new PostComment({
        threadId: 'thread-123',
        content: 'Halo!',
        userId: 'user-123',
      });

      const fakeIdGenerator = () => '456';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await commentRepositoryPostgres.addComment(postComment);

      const comment = await CommentsTableTestHelper.findCommentById('comment-456');
      expect(comment).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      const postComment = new PostComment({
        threadId: 'thread-123',
        content: 'Halo!',
        userId: 'user-123',
      });

      const fakeIdGenerator = () => '456';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      const postedComment = await commentRepositoryPostgres.addComment(postComment);
      expect(postedComment).toStrictEqual(new PostedComment({
        id: 'comment-456',
        body: 'Halo!',
        owner: 'user-123',
      }));
    });
  });

  describe('checkCommentExistence function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      const fakeIdGenerator = () => '456';
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await expect(commentRepository.checkCommentExistence('nonexistentId'))
        .rejects.toThrow(NotFoundError);
    });

    it('should return true when comment exists', async () => {
      const fakeIdGenerator = () => '456';
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      const commentExists = await commentRepository.checkCommentExistence('comment-123');

      expect(commentExists).toEqual(true);
    });

    it('should return false when comment status is deleted', async () => {
      await CommentsTableTestHelper.addDeletedComment({ id: 'comment-todelete' });

      const fakeIdGenerator = () => '456';
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      const commentExists = await commentRepository.checkCommentExistence('comment-todelete');

      expect(commentExists).toEqual(false);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw NotFoundError when no matching data found', async () => {
      const fakeIdGenerator = () => '456';
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await expect(commentRepository.verifyCommentOwner({
        commentId: 'comment-nonexistent',
        userId: 'user-123',
      })).rejects.toThrow(NotFoundError);
    });

    it('should throw AuthorizationError when userId is not the comment owner', async () => {
      const fakeIdGenerator = () => '456';
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await expect(commentRepository.verifyCommentOwner({
        commentId: 'comment-123',
        userId: 'user-123',
      })).rejects.toThrow(AuthorizationError);
    });

    it('should return true when userId is the comment owner', async () => {
      const fakeIdGenerator = () => '456';
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      const isOwnComment = await commentRepository.verifyCommentOwner({
        commentId: 'comment-123',
        userId: 'user-456',
      });

      expect(isOwnComment).toEqual(true);
    });
  });

  describe('getThreadComments function', () => {
    it('should return empty array if thread has no comments', async () => {
      const threadId = 'thread-gotnocommentsyet';
      await ThreadsTableTestHelper.addThread({ id: threadId });

      const fakeIdGenerator = () => '456';
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      const comments = await commentRepository.getThreadComments(threadId);

      expect(comments).toStrictEqual([]);
    });

    it('should return array of thread comments in ascending order', async () => {
      const threadId = 'thread-tocommenton';
      const firstCommentId = 'comment-first';
      const secondCommentId = 'comment-second';
      await ThreadsTableTestHelper.addThread({ id: threadId });
      await CommentsTableTestHelper.addComment({ threadId, id: firstCommentId });
      await CommentsTableTestHelper.addComment({ threadId, id: secondCommentId });

      const fakeIdGenerator = () => '456';
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      const comments = await commentRepository.getThreadComments(threadId);

      expect(comments).toHaveLength(2);
      comments.forEach((comment) => {
        expect(comment).toBeInstanceOf(CommentDetail);
      });

      // comment properties & sorting
      const [comment1, comment2] = comments;
      expect(comment1).toEqual({
        id: firstCommentId,
        username: 'dicoding',
        date: expect.any(String),
        content: 'comment test helper',
      });
      expect(comment2).toEqual({
        id: secondCommentId,
        username: 'dicoding',
        date: expect.any(String),
        content: 'comment test helper',
      });
    });
  });

  describe('softDeleteComment function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      const fakeIdGenerator = () => '456';
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await expect(commentRepository.softDeleteComment('comment-nonexistent'))
        .rejects.toThrow(NotFoundError);
    });

    it('should soft-delete comment from database', async () => {
      const fakeIdGenerator = () => '456';
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      const result = await commentRepository.softDeleteComment('comment-123');

      expect(result).toStrictEqual({ isDeleted: true });
    });
  });
});
