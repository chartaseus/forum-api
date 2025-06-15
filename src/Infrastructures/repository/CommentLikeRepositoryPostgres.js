const CommentLikeRepository = require('../../Domains/likes/CommentLikeRepository');

class CommentLikeRepositoryPostgres extends CommentLikeRepository {
  constructor(pool) {
    super();
    this._pool = pool;
  }

  async checkUserLikeOnComment({ commentId, userId }) {
    const query = {
      text: 'SELECT * FROM comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, userId],
    };

    const { rowCount } = await this._pool.query(query);

    if (rowCount === 1) {
      return true;
    } else {
      return false;
    }
  }

  async addLike({ commentId, userId }) {
    const query = {
      text: 'INSERT INTO comment_likes (comment_id, user_id) VALUES($1, $2)',
      values: [commentId, userId],
    };

    await this._pool.query(query);
  }

  async deleteLike({ commentId, userId }) {
    const query = {
      text: 'DELETE FROM comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, userId],
    };

    await this._pool.query(query);
  }
}

module.exports = CommentLikeRepositoryPostgres;
