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

    it('should return true when thread exists', async () => {
      await ThreadsTableTestHelper.addThread({});

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      const threadExists = await threadRepositoryPostgres.checkThreadExistence('thread-123');

      expect(threadExists).toEqual(true);
    });

    it('should return false when thread status is deleted', async () => {
      await ThreadsTableTestHelper.addDeletedThread({ id: 'thread-todelete' });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      const threadExists = await threadRepositoryPostgres.checkThreadExistence('thread-todelete');

      expect(threadExists).toEqual(false);
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
      expect(thread).toEqual({
        id: threadId,
        title: 'test',
        body: 'test helper',
        date: expect.any(String),
        username: 'dicoding',
      });
    });
  });
});
