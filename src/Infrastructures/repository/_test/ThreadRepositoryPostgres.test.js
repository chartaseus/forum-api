const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const PostedThread = require('../../../Domains/threads/entities/PostedThread');
const PostThread = require('../../../Domains/threads/entities/PostThread');
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({});
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addThread function', () => {
    it('should add thread persistently', async () => {
      const postThread = new PostThread({
        title: 'my first thread',
        body: 'Halo!',
        userId: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await threadRepositoryPostgres.addThread(postThread);

      const thread = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(thread).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      const postThread = new PostThread({
        title: 'my first thread',
        body: 'Halo!',
        userId: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      const postedThread = await threadRepositoryPostgres.addThread(postThread);
      expect(postedThread).toStrictEqual(new PostedThread({
        id: 'thread-123',
        title: 'my first thread',
        owner: 'user-123',
      }));
    });
  });

  describe('checkThreadExistence function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      const nonexistentThreadId = 'thread-takada';
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await expect(threadRepositoryPostgres.checkThreadExistence(nonexistentThreadId))
        .rejects.toThrow(NotFoundError);
    });
    it('should not throw error when thread exists', async () => {
      await ThreadsTableTestHelper.addThread({ userId: 'user-123' });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await expect(threadRepositoryPostgres.checkThreadExistence('thread-123'))
        .resolves.not.toThrow();
    });
  });

  describe('getThreadById function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      const nonexistentThreadId = 'thread-takada';
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await expect(threadRepositoryPostgres.getThreadById(nonexistentThreadId))
        .rejects.toThrow(NotFoundError);
    });

    it('should return thread correctly', async () => {
      const threadId = 'thread-123456';
      await ThreadsTableTestHelper.addThread({ id: threadId });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      const thread = await threadRepositoryPostgres.getThreadById(threadId);

      expect(thread).toBeInstanceOf(ThreadDetail);
      expect(thread).toMatchObject({
        id: threadId,
        title: 'test',
        body: 'test helper',
        username: 'dicoding',
      });
    });
  });
});
