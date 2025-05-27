const PostReply = require('../../Domains/replies/entities/PostReply');

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    // create payload object
    const postReply = new PostReply(useCasePayload);

    // verify thread existence
    await this._threadRepository.checkThreadExistence(postReply.threadId);

    // verify comment existence
    await this._commentRepository.checkCommentExistence(postReply.commentId);

    // add reply to database
    const postedReply = await this._replyRepository.addReply(postReply);

    // return data for response
    return postedReply;
  }
}

module.exports = AddReplyUseCase;
