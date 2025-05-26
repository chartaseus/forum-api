const CommentDetail = require('../CommentDetail');

describe('a CommentDetail entity', () => {
  it('should throw error when payload does not contain required property', () => {
    const payload = {
      id: '123456',
      content: 'isi komentar',
    };

    expect(() => new CommentDetail(payload)).toThrow('COMMENT_DETAIL.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', () => {
    const payload = {
      id: 123456,
      content: 'isi komentar',
      date: '2025-05-26T06:33:54.598Z',
      username: 'user2',
    };

    expect(() => new CommentDetail(payload)).toThrow('COMMENT_DETAIL.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create CommentDetail object correctly', () => {
    const payload = {
      id: '123456',
      content: 'isi komentar',
      date: '2025-05-26T06:33:54.598Z',
      username: 'user2',
    };

    const { id, content, date, username } = new CommentDetail(payload);

    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
  });
});
