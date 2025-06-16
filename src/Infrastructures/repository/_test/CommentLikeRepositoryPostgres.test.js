const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const CommentLikeRepositoryPostgres = require('../CommentLikeRepositoryPostgres');

describe('CommentLikeRepositoryPostgres', () => {
  const userId = 'user-commentliketest';
  const threadId = 'thread-commentliketest';
  const commentId = 'comment-commentliketest';

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: userId });
    await ThreadsTableTestHelper.addThread({ id: threadId, userId });
    await CommentsTableTestHelper.addComment({
      id: commentId,
      threadId,
      userId,
    });
  });

  afterEach(async () => {
    await CommentLikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('checkUserLikeOnComment function', () => {
    it('should return true when user has liked comment', async () => {
      await CommentLikesTableTestHelper.addLike({ commentId, userId });

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool);

      const hasUserLikedComment = await commentLikeRepositoryPostgres
        .checkUserLikeOnComment({ commentId, userId });

      expect(hasUserLikedComment).toEqual(true);
    });

    it('should return false when user has not liked comment', async () => {
      const otherUserId = 'user-whohasnotlikedcomment';
      await UsersTableTestHelper.addUser({
        id: otherUserId,
        username: 'iJustGotHere',
      });

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool);

      const hasUserLikedComment = await commentLikeRepositoryPostgres
        .checkUserLikeOnComment({ commentId, otherUserId });

      expect(hasUserLikedComment).toEqual(false);
    });
  });

  describe('addLike function', () => {
    it('should add like data to database', async () => {
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool);

      await commentLikeRepositoryPostgres.addLike({ commentId, userId });

      const data = await CommentLikesTableTestHelper.findData({ commentId, userId });

      expect(data).toHaveLength(1);
    });
  });

  describe('deleteLike function', () => {
    it('should delete like data from database', async () => {
      await CommentLikesTableTestHelper.addLike({ commentId, userId });

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool);

      await commentLikeRepositoryPostgres.deleteLike({ commentId, userId });

      const data = await CommentLikesTableTestHelper.findData({ commentId, userId });

      expect(data).toHaveLength(0);
    });
  });
});
