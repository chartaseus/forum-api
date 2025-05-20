const CommentRepository = require('../CommentRepository');

describe('CommentRepository interface', () => {
  it('should throw error when abstract behavior invoked', async () => {
    const commentRepository = new CommentRepository();

    await expect(commentRepository.addComment({}))
      .rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentRepository.getCommentById(''))
      .rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentRepository.getThreadComments(''))
      .rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentRepository.editComment(''))
      .rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
