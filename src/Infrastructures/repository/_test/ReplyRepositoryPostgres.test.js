const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const PostedReply = require('../../../Domains/replies/entities/PostedReply');
const PostReply = require('../../../Domains/replies/entities/PostReply');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

describe('ReplyRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
    await CommentsTableTestHelper.addComment({});

    // add a second user
    await UsersTableTestHelper.addUser({
      id: 'user-456',
      username: 'seconduser',
    });
  });
  beforeEach(async () => {

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
});
