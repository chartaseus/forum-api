const pool = require('../src/Infrastructures/database/postgres/pool');

/* istanbul ignore file */
const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123',
    threadId = 'thread-123',
    body = 'comment test helper',
    userId = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4)',
      values: [id, body, userId, threadId],
    };

    await pool.query(query);
  },

  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async addDeletedComment({
    id = 'comment-123deleted',
    threadId = 'thread-123',
    body = 'comment test helper',
    userId = 'user-123',
    isDeleted = true,
  }) {
    const query = {
      text: 'INSERT INTO comments (id, body, owner, parent, is_deleted) VALUES($1, $2, $3, $4, $5)',
      values: [id, body, userId, threadId, isDeleted],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
