class DeleteReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    // validate payload
    this._validatePayload(useCasePayload);

    const { replyId, commentId, threadId, userId } = useCasePayload;

    // check thread existence
    await this._threadRepository.checkThreadExistence(threadId);

    // check comment existence
    await this._commentRepository.checkCommentExistence(commentId);

    // check reply existence
    await this._replyRepository.checkReplyExistence(replyId);

    // verify reply owner
    await this._replyRepository.verifyReplyOwner({ replyId, userId });

    // update is_deleted to true
    await this._replyRepository.softDeleteReply(replyId);
  }

  _validatePayload(payload) {
    const { replyId, commentId, threadId, userId } = payload;

    if (!replyId || !commentId || !threadId || !userId) {
      throw new Error('DELETE_REPLY_USE_CASE.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof replyId !== 'string'
      || typeof commentId !== 'string'
      || typeof threadId !== 'string'
      || typeof userId !== 'string') {
      throw new Error('DELETE_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteReplyUseCase;
