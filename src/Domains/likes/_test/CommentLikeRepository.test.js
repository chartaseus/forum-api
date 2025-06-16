const CommentLikeRepository = require('../CommentLikeRepository');

describe('CommentLikeRepository interface', () => {
  it('should throw error when abstract behavior invoked', async () => {
    const commentLikeRepository = new CommentLikeRepository();

    await expect(commentLikeRepository.checkUserLikeOnComment({}))
      .rejects.toThrow('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentLikeRepository.addLike({}))
      .rejects.toThrow('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentLikeRepository.deleteLike({}))
      .rejects.toThrow('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
