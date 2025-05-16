const PostThread = require('../PostThread');

describe ('a PostThread entity', () => {
  it('should throw error when payload does not contain required property', () => {
    const payload = { title: 'my first thread' };

    expect(() => new PostThread(payload)).toThrow('POST_THREAD.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', () => {
    const payload = {
      title: 'my first thread',
      body: true,
    };

    expect(() => new PostThread(payload)).toThrow('POST_THREAD.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create postThread object correctly', () => {
    const payload = {
      title: 'my first thread',
      body: 'Halo!',
    };

    const { title, body } = new PostThread(payload);

    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
  });
});
