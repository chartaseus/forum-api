const PostComment = require('../../Domains/comments/entities/PostComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    // verify thread existence
    const { threadId } = useCasePayload;
    await this._threadRepository.checkThreadExistence(threadId);

    // create payload object
    const postComment = new PostComment(useCasePayload);

    // add comment to database
    const postedComment = await this._commentRepository.addComment(postComment);

    // return data for response
    return postedComment;
  }
}

module.exports = AddCommentUseCase;
