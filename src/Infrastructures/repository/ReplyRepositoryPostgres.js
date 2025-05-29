const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const PostedReply = require('../../Domains/replies/entities/PostedReply');
const ReplyDetail = require('../../Domains/replies/entities/ReplyDetail');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(postReply) {
    const { content, userId, commentId } = postReply;
    const id = `reply-${this._idGenerator()}`;

    const query = {
      text: `INSERT INTO replies
        VALUES($1, $2, $3, $4)
        RETURNING id, body AS "content", owner`,
      values: [id, content, userId, commentId],
    };

    const result = await this._pool.query(query);

    return new PostedReply(result.rows[0]);
  }

  async getThreadReplies(threadId) {
    const query = {
      text: `SELECT
          replies.id,
          replies.time::TEXT AS "date",
          replies.body AS "content",
          replies.parent AS "commentId",
          replies.is_deleted AS "isDeleted",
          users.username
        FROM replies
        INNER JOIN comments ON replies.parent = comments.id
        INNER JOIN users ON replies.owner = users.id
        WHERE comments.parent = $1
        ORDER BY replies.time ASC`,
      values: [threadId],
    };

    const { rows } = await this._pool.query(query);

    return rows.map((reply) => new ReplyDetail(reply));
  }

  async checkReplyExistence(id) {
    const query = {
      text: 'SELECT is_deleted AS "isDeleted" FROM replies WHERE id = $1',
      values: [id],
    };

    const { rows, rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('balasan tidak ditemukan');
    }

    return !rows[0].isDeleted;
  }

  async verifyReplyOwner({ replyId, userId }) {
    const query = {
      text: 'SELECT owner FROM replies WHERE id = $1',
      values: [replyId],
    };

    const { rows, rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('balasan tidak ditemukan');
    }

    if (rows[0].owner === userId) {
      return true;
    } else {
      throw new AuthorizationError('Anda bukan pemilik balasan ini');
    }
  }

  async softDeleteReply(id) {
    const query = {
      text: `UPDATE replies
        SET is_deleted = true 
        WHERE id = $1
        RETURNING is_deleted AS "isDeleted"`,
      values: [id],
    };

    const { rows, rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('balasan tidak ditemukan');
    }

    return rows[0];
  }
}

module.exports = ReplyRepositoryPostgres;
