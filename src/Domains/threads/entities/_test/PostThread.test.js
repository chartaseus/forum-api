const PostThread = require('../PostThread');

describe('a PostThread entity', () => {
  it('should throw error when payload does not contain required property', () => {
    const payload = { title: 'my first thread' };

    expect(() => new PostThread(payload)).toThrow('POST_THREAD.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', () => {
    const payload = {
      title: 'my first thread',
      body: true,
      userId: 22,
    };

    expect(() => new PostThread(payload)).toThrow('POST_THREAD.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when userId exceeds 50 characters', () => {
    const payload = {
      title: 'my first thread',
      body: 'Halo!',
      userId: 'user-12345678901234567890123456789012345678901234567890',
    };

    expect(() => new PostThread(payload)).toThrow('POST_THREAD.USERID_LIMIT_CHAR');
  });

  it('should create postThread object correctly', () => {
    const payload = {
      title: 'my first thread',
      body: 'Halo!',
      userId: 'user-22',
    };

    const { title, body, userId } = new PostThread(payload);

    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(userId).toEqual(payload.userId);
  });
});
