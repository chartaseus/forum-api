/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
  async addThread({
    id = 'thread-123',
    title = 'test',
    body = 'test helper',
     userId = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4)',
      values: [id, title, body, userId],
    };

    await pool.query(query);
  },

  async addDeletedThread({
    id = 'thread-deleted',
    title = 'test',
    body = 'test helper',
    userId = 'user-123',
    isDeleted = true,
  }) {
    const query = {
      text: 'INSERT INTO threads (id, title, body, owner, is_deleted) VALUES($1, $2, $3, $4, $5)',
      values: [id, title, body, userId, isDeleted],
    };

    await pool.query(query);
  },

  async findThreadById(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1=1');
  },
};

module.exports = ThreadsTableTestHelper;
