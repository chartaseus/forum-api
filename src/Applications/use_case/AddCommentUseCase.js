const PostComment = require('../../Domains/comments/entities/PostComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    // create payload object
    const postComment = new PostComment(useCasePayload);

    // verify thread existence
    await this._threadRepository.checkThreadExistence(postComment.threadId);

    // add comment to database
    const postedComment = await this._commentRepository.addComment(postComment);

    // return data for response
    return postedComment;
  }
}

module.exports = AddCommentUseCase;
