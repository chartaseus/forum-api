class PostReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const { content, commentId, threadId, userId } = payload;

    this.content = content;
    this.commentId = commentId;
    this.threadId = threadId;
    this.userId = userId;
  }

  _verifyPayload({ content, userId, threadId, commentId }) {
    if (!content || !userId || !threadId || !commentId) {
      throw new Error('POST_REPLY.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string'
      || typeof userId !== 'string'
      || typeof threadId !== 'string'
      || typeof commentId !== 'string') {
      throw new Error('POST_REPLY.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (userId.length > 50) {
      throw new Error('POST_REPLY.USERID_LIMIT_CHAR');
    }

    if (threadId.length > 50) {
      throw new Error('POST_REPLY.THREADID_LIMIT_CHAR');
    }

    if (commentId.length > 50) {
      throw new Error('POST_REPLY.COMMENTID_LIMIT_CHAR');
    }
  }
};

module.exports = PostReply;
