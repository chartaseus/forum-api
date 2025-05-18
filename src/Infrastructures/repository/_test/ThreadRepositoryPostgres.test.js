const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const PostedThread = require('../../../Domains/threads/entities/PostedThread');
const PostThread = require('../../../Domains/threads/entities/PostThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

const testUserId = 'user-test';

describe('ThreadRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({
      id: testUserId,
      username: 'threadrepositorytesthelper',
      password: 'test',
      fullname: 'thread repository test helper',
    });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should add thread persistently', async () => {
      const postThread = new PostThread({
        title: 'my first thread',
        body: 'Halo!',
        userId: testUserId,
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
        userId: testUserId,
      });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      const postedThread = await threadRepositoryPostgres.addThread(postThread);
      expect(postedThread).toStrictEqual(new PostedThread({
        id: 'thread-123',
        title: 'my first thread',
        owner: testUserId,
      }));
    });
  });

  // describe('getThreadById function', () => {
  //   it('should throw NotFoundError when thread not found');
  //   it('should return thread correctly');
  // });
});
