const PostedThread = require('../PostedThread');

describe('a PostedThread entity', () => {
  it('should throw error when payload does not contain required property', () => {
    const payload = {
      title: 'my first thread',
      owner: 'user1',
    };

    expect(() => new PostedThread(payload)).toThrow('POST_THREAD.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', () => {
    const payload = {
      id: 22,
      title: 'my first thread',
      owner: 'user1',
    };

    expect(() => new PostedThread(payload)).toThrow('POST_THREAD.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create postedThread object correctly', () => {
    const payload = {
      id: '22',
      title: 'my first thread',
      owner: 'user1',
    };

    const { id, title, owner } = new PostedThread(payload);

    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(owner).toEqual(payload.owner);
  });
});
