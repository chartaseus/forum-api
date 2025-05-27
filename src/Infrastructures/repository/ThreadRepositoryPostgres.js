const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const PostedThread = require('../../Domains/threads/entities/PostedThread');
const ThreadDetail = require('../../Domains/threads/entities/ThreadDetail');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(postThread) {
    const { title, body, userId } = postThread;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, owner',
      values: [id, title, body, userId],
    };

    const result = await this._pool.query(query);

    return new PostedThread(result.rows[0]);
  }

  async checkThreadExistence(id) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }
  }

  async getThreadById(id) {
    const query = {
      text: `SELECT
          threads.id,
          threads.title,
          threads.body,
          threads.time::TEXT AS "date",
          users.username
        FROM threads
        INNER JOIN users ON threads.owner = users.id
        WHERE threads.id = $1`,
      values: [id],
    };

    const { rows, rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    return new ThreadDetail(rows[0]);
  }
}

module.exports = ThreadRepositoryPostgres;
