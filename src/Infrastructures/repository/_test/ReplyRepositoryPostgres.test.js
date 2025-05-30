const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const PostedReply = require('../../../Domains/replies/entities/PostedReply');
const PostReply = require('../../../Domains/replies/entities/PostReply');
const ReplyDetail = require('../../../Domains/replies/entities/ReplyDetail');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

describe('ReplyRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({});
    await UsersTableTestHelper.addUser({ id: 'user-456', username: 'seconduser' });
    await ThreadsTableTestHelper.addThread({});
    await CommentsTableTestHelper.addComment({});
  });

  beforeEach(async () => {
    await RepliesTableTestHelper.addReply({});
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

  describe('addReply function', () => {
    it('should add reply persistently', async () => {
      const postReply = new PostReply({
        content: 'Halo!',
        commentId: 'comment-123',
        threadId: 'thread-123',
        userId: 'user-123',
      });

      const fakeIdGenerator = () => '456';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await replyRepositoryPostgres.addReply(postReply);

      const replies = await RepliesTableTestHelper.findReplyById('reply-456');
      expect(replies).toHaveLength(1);
    });

    it('should return added reply correctly', async () => {
      const postReply = new PostReply({
        content: 'Halo!',
        commentId: 'comment-123',
        threadId: 'thread-123',
        userId: 'user-123',
      });

      const fakeIdGenerator = () => '456';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      const postedReply = await replyRepositoryPostgres.addReply(postReply);

      expect(postedReply).toStrictEqual(new PostedReply({
        id: 'reply-456',
        content: 'Halo!',
        owner: 'user-123',
      }));
    });
  });

  describe('getThreadReplies function', () => {
    it('should return empty array if thread has no replies', async () => {
      const threadId = 'thread-gotnorepliesyet';
      await ThreadsTableTestHelper.addThread({ id: threadId });

      const fakeIdGenerator = () => '456';
      const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      const replies = await replyRepository.getThreadReplies(threadId);

      expect(replies).toStrictEqual([]);
    });

    it('should return array of replies in ascending order', async () => {
      const threadId = 'thread-456';
      const commentId = 'comment-456';
      const firstReplyId = 'reply-first';
      const secondReplyId = 'reply-second';
      await ThreadsTableTestHelper.addThread({ id: threadId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId });
      await RepliesTableTestHelper.addReply({ commentId, id: firstReplyId });
      await RepliesTableTestHelper.addReply({ commentId, id: secondReplyId });

      const fakeIdGenerator = () => '456';
      const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      const replies = await replyRepository.getThreadReplies(threadId);

      expect(replies).toHaveLength(2);
      replies.forEach((reply) => {
        expect(reply).toBeInstanceOf(ReplyDetail);
      });

      // reply properties & sorting
      const [reply1, reply2] = replies;
      expect(reply1).toEqual({
        id: firstReplyId,
        username: 'dicoding',
        date: expect.any(String),
        commentId: commentId,
        content: 'reply test helper',
      });
      expect(reply2).toEqual({
        id: secondReplyId,
        username: 'dicoding',
        date: expect.any(String),
        commentId: commentId,
        content: 'reply test helper',
      });
    });
  });

  describe('checkReplyExistence function', () => {
    it('should throw NotFoundError when reply not found', async () => {
      const fakeIdGenerator = () => '456';
      const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await expect(replyRepository.checkReplyExistence('nonexistentId'))
        .rejects.toThrow(NotFoundError);
    });

    it('should return true when reply exists', async () => {
      const fakeIdGenerator = () => '456';
      const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      const replyExists = await replyRepository.checkReplyExistence('reply-123');

      expect(replyExists).toEqual(true);
    });

    it('should return false when reply status is deleted', async () => {
      await RepliesTableTestHelper.addDeletedReply({ id: 'reply-todelete' });

      const fakeIdGenerator = () => '456';
      const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      const replyExists = await replyRepository.checkReplyExistence('reply-todelete');

      expect(replyExists).toEqual(false);
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should throw NotFoundError when no matching data found', async () => {
      const fakeIdGenerator = () => '456';
      const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await expect(replyRepository.verifyReplyOwner({
        replyId: 'reply-nonexistent',
        userId: 'user-123',
      })).rejects.toThrow(NotFoundError);
    });

    it('should throw AuthorizationError when userId is not the reply owner', async () => {
      const fakeIdGenerator = () => '456';
      const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await expect(replyRepository.verifyReplyOwner({
        replyId: 'reply-123',
        userId: 'user-456',
      })).rejects.toThrow(AuthorizationError);
    });

    it('should return true when userId is the reply owner', async () => {
      const fakeIdGenerator = () => '456';
      const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      const isOwnReply = await replyRepository.verifyReplyOwner({
        replyId: 'reply-123',
        userId: 'user-123',
      });

      expect(isOwnReply).toEqual(true);
    });
  });

  describe('softDeleteReply function', () => {
    it('should throw NotFoundError when reply not found', async () => {
      const fakeIdGenerator = () => '456';
      const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await expect(replyRepository.softDeleteReply('reply-nonexistent'))
        .rejects.toThrow(NotFoundError);
    });

    it('should soft-delete reply from database', async () => {
      const fakeIdGenerator = () => '456';
      const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      const result = await replyRepository.softDeleteReply('reply-123');

      expect(result).toStrictEqual({ isDeleted: true });
    });
  });
});
