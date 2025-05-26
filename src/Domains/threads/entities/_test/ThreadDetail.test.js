const ThreadDetail = require('../ThreadDetail');

describe('a ThreadDetail entity', () => {
  it('should throw error when payload does not contain required property', () => {
    const payload = {
      id: '123',
      title: 'judul thread',
      body: 'isi thread',
    };

    expect(() => new ThreadDetail(payload)).toThrow('THREAD_DETAIL.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', () => {
    const payload = {
      id: '123',
      title: 'judul thread',
      body: 'isi thread',
      date: new Date(),
      username: 'user1',
    };

    expect(() => new ThreadDetail(payload)).toThrow('THREAD_DETAIL.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create ThreadDetail object correctly', () => {
    const payload = {
      id: '123',
      title: 'judul thread',
      body: 'isi thread',
      date: '2025-05-26T06:33:54.598Z',
      username: 'user1',
    };

    const { id, title, body, date, username } = new ThreadDetail(payload);

    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
  });
});
