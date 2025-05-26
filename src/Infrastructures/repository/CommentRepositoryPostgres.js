const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const CommentDetail = require('../../Domains/comments/entities/CommentDetail');
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

  async checkCommentExistence(id) {
    const query = {
      text: 'SELECT is_deleted FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak ditemukan');
    }

    return !result.rows[0].is_deleted;
  }

  async verifyCommentOwner({ commentId, userId }) {
    const query = {
      text: 'SELECT owner FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak ditemukan');
    }

    if (result.rows[0].owner === userId) {
      return true;
    } else {
      throw new AuthorizationError('Anda bukan pemilik komentar ini');
    }
  }

  async getThreadComments(threadId) {
    const query = {
      text: `SELECT comments.id, comments.time, comments.body, users.username
        FROM comments
        INNER JOIN users ON comments.owner = users.id
        WHERE comments.parent = $1
        ORDER BY comments.time ASC`,
      values: [threadId],
    };

    const { rows } = await this._pool.query(query);

    return rows.map((comment) => new CommentDetail({
      ...comment,
      date: comment.time.toString(),
      content: comment.body,
    }));
  }

  async softDeleteComment(id) {
    const query = {
      text: 'UPDATE comments SET is_deleted = true WHERE id = $1 RETURNING is_deleted',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak ditemukan');
    }

    return result.rows[0];
  }
}

module.exports = CommentRepositoryPostgres;
