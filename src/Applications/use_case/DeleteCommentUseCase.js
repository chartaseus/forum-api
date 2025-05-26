class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    // validate payload
    this._validatePayload(useCasePayload);

    const { commentId, threadId, userId } = useCasePayload;

    // check thread existence
    await this._threadRepository.checkThreadExistence(threadId);

    // check comment existence
    await this._commentRepository.checkCommentExistence(commentId);

    // verify comment owner
    await this._commentRepository.verifyCommentOwner({ commentId, userId });

    // update is_deleted to true
    await this._commentRepository.softDeleteComment(commentId);
  }

  _validatePayload(payload) {
    const { commentId, threadId, userId } = payload;

    if (!commentId || !threadId || !userId) {
      throw new Error('DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof commentId !== 'string' || typeof threadId !== 'string' || typeof userId !== 'string') {
      throw new Error('DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteCommentUseCase;
