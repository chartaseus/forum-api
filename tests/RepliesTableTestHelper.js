const pool = require('../src/Infrastructures/database/postgres/pool');

/* istanbul ignore file */
const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-123',
    commentId = 'comment-123',
    body = 'reply test helper',
    userId = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4)',
      values: [id, body, userId, commentId],
    };

    await pool.query(query);
  },

  async findReplyById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async addDeletedReply({
    id = 'reply-deleted',
    commentId = 'comment-123',
    body = 'reply test helper',
    userId = 'user-123',
    isDeleted = true,
  }) {
    const query = {
      text: 'INSERT INTO replies (id, body, owner, parent, is_deleted) VALUES($1, $2, $3, $4, $5)',
      values: [id, body, userId, commentId, isDeleted],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

module.exports = RepliesTableTestHelper;
