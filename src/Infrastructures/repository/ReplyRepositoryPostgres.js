const PostedReply = require('../../Domains/replies/entities/PostedReply');
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
}

module.exports = ReplyRepositoryPostgres;
