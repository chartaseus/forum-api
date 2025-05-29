const PostReply = require('../PostReply');

describe('a PostReply entity', () => {
  it('should throw error when payload does not contain required property', () => {
    const payloadWithoutcontent = {
      userId: 'user-2',
      threadId: 'thread-1',
      commentId: 'comment-1',
    };
    const payloadWithoutUserId = {
      content: 'isi komentar',
      threadId: 'thread-1',
      commentId: 'comment-1',
    };
    const payloadWithoutThreadId = {
      content: 'isi komentar',
      userId: 'user-2',
      commentId: 'comment-1',
    };
    const payloadWithoutCommentId = {
      content: 'isi komentar',
      userId: 'user-2',
      threadId: 'thread-1',
    };

    expect(() => new PostReply(payloadWithoutcontent)).toThrow('POST_REPLY.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new PostReply(payloadWithoutUserId)).toThrow('POST_REPLY.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new PostReply(payloadWithoutThreadId)).toThrow('POST_REPLY.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new PostReply(payloadWithoutCommentId)).toThrow('POST_REPLY.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', () => {
    const payloadWithBadcontent = {
      content: true,
      userId: 'user-2',
      threadId: 'thread-1',
      commentId: 'comment-1',
    };
    const payloadWithBadUserId = {
      content: 'isi komentar',
      userId: 2,
      threadId: 'thread-1',
      commentId: 'comment-1',
    };
    const payloadWithBadThreadId = {
      content: 'isi komentar',
      userId: 'user-2',
      threadId: 11,
      commentId: 'comment-1',
    };
    const payloadWithBadCommentId = {
      content: 'isi komentar',
      userId: 'user-2',
      threadId: 11,
      commentId: ['comment-1'],
    };

    expect(() => new PostReply(payloadWithBadcontent)).toThrow('POST_REPLY.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new PostReply(payloadWithBadUserId)).toThrow('POST_REPLY.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new PostReply(payloadWithBadThreadId)).toThrow('POST_REPLY.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new PostReply(payloadWithBadCommentId)).toThrow('POST_REPLY.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when userId exceeds 50 characters', () => {
    const payload = {
      content: 'isi komentar',
      userId: 'user-12345678901234567890123456789012345678901234567890',
      threadId: 'thread-1',
      commentId: 'comment-1',
    };

    expect(() => new PostReply(payload)).toThrow('POST_REPLY.USERID_LIMIT_CHAR');
  });

  it('should throw error when threadId exceeds 50 characters', () => {
    const payload = {
      content: 'isi komentar',
      userId: 'user-1',
      threadId: 'thread-12345678901234567890123456789012345678901234567890',
      commentId: 'comment-1',
    };

    expect(() => new PostReply(payload)).toThrow('POST_REPLY.THREADID_LIMIT_CHAR');
  });

  it('should throw error when commentId exceeds 50 characters', () => {
    const payload = {
      content: 'isi komentar',
      userId: 'user-1',
      threadId: 'thread-1',
      commentId: 'comment-12345678901234567890123456789012345678901234567890',
    };

    expect(() => new PostReply(payload)).toThrow('POST_REPLY.COMMENTID_LIMIT_CHAR');
  });

  it('should create PostReply object correctly', () => {
    const payload = {
      content: 'isi komentar',
      userId: 'user-2',
      threadId: 'thread-1',
      commentId: 'comment-1',
    };

    const { content, userId, threadId, commentId } = new PostReply(payload);

    expect(content).toEqual(payload.content);
    expect(userId).toEqual(payload.userId);
    expect(threadId).toEqual(payload.threadId);
    expect(commentId).toEqual(payload.commentId);
  });
});
