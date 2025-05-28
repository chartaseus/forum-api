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
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4) RETURNING id, body AS "content", owner',
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
}

module.exports = ReplyRepositoryPostgres;
