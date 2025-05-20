const PostComment = require('../PostComment');

describe ('a PostComment entity', () => {
  it('should throw error when payload does not contain required property', () => {
    const payloadWithoutcontent = {
      userId: 'user-2',
      threadId: 'thread-1',
    };
    const payloadWithoutUserId = {
      content: 'isi komentar',
      threadId: 'thread-1',
    };
    const payloadWithoutThreadId = {
      content: 'isi komentar',
      userId: 'user-2',
    };

    expect(() => new PostComment(payloadWithoutcontent)).toThrow('POST_COMMENT.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new PostComment(payloadWithoutUserId)).toThrow('POST_COMMENT.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new PostComment(payloadWithoutThreadId)).toThrow('POST_COMMENT.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', () => {
    const payloadWithBadcontent = {
      content: true,
      userId: 'user-2',
      threadId: 'thread-1',
    };
    const payloadWithBadUserId = {
      content: 'isi komentar',
      userId: 2,
      threadId: 'thread-1',
    };
    const payloadWithBadThreadId = {
      content: 'isi komentar',
      userId: 'user-2',
      threadId: 11,
    };

    expect(() => new PostComment(payloadWithBadcontent)).toThrow('POST_COMMENT.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new PostComment(payloadWithBadUserId)).toThrow('POST_COMMENT.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new PostComment(payloadWithBadThreadId)).toThrow('POST_COMMENT.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when userId exceeds 50 characters', () => {
    const payload = {
      content: 'isi komentar',
      userId: 'user-12345678901234567890123456789012345678901234567890',
      threadId: 'thread-1',
    };

    expect(() => new PostComment(payload)).toThrow('POST_COMMENT.USERID_LIMIT_CHAR');
  });

  it('should throw error when threadId exceeds 50 characters', () => {
    const payload = {
      content: 'isi komentar',
      userId: 'user-1',
      threadId: 'thread-12345678901234567890123456789012345678901234567890',
    };

    expect(() => new PostComment(payload)).toThrow('POST_COMMENT.THREADID_LIMIT_CHAR');
  });

  it('should create postComment object correctly', () => {
    const payload = {
      content: 'isi komentar',
      userId: 'user-2',
      threadId: 'thread-1',
    };

    const { content, userId, threadId } = new PostComment(payload);

    expect(content).toEqual(payload.content);
    expect(userId).toEqual(payload.userId);
    expect(threadId).toEqual(payload.threadId);
  });
});
