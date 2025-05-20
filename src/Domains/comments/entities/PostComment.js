class PostComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { content, userId, threadId } = payload;

    this.content = content;
    this.userId = userId;
    this.threadId = threadId;
  }

  _verifyPayload({ content, userId, threadId }) {
    if (!content || !userId || !threadId) {
      throw new Error('POST_COMMENT.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof userId !== 'string' || typeof threadId !== 'string') {
      throw new Error('POST_COMMENT.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (userId.length > 50) {
      throw new Error('POST_COMMENT.USERID_LIMIT_CHAR');
    }

    if (threadId.length > 50) {
      throw new Error('POST_COMMENT.THREADID_LIMIT_CHAR');
    }
  }
};

module.exports = PostComment;
