class LikeCommentUseCase {
  constructor({ likeRepository, commentRepository, threadRepository }) {
    this._likeRepository = likeRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    // validate payload
    this._validatePayload(useCasePayload);

    const { threadId, commentId, userId } = useCasePayload;

    // check thread existence
    await this._threadRepository.checkThreadExistence(threadId);

    // check comment existence
    await this._commentRepository.checkCommentExistence(commentId);

    // check if user has liked comment
    const hasUserLikedComment = await this._likeRepository.checkUserLikeOnComment({ commentId, userId });

    // user has liked ? delete like : add like
    hasUserLikedComment
      ? await this._likeRepository.deleteLike({ commentId, userId })
      : await this._likeRepository.addLike({ commentId, userId });
  }

  _validatePayload(payload) {
    const { commentId, threadId, userId } = payload;

    if (!commentId || !threadId || !userId) {
      throw new Error('LIKE_COMMENT_USE_CASE.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof commentId !== 'string'
      || typeof threadId !== 'string'
      || typeof userId !== 'string') {
      throw new Error('LIKE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = LikeCommentUseCase;
