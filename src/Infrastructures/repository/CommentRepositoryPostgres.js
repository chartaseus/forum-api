const CommentRepository = require('../../Domains/comments/CommentRepository');
const PostedComment = require('../../Domains/comments/entities/PostedComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(postComment) {
    const { content, userId, threadId } = postComment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id, body, owner',
      values: [id, content, userId, threadId],
    };

    const result = await this._pool.query(query);

    return new PostedComment({ ...result.rows[0] });
  }
}

module.exports = CommentRepositoryPostgres;
