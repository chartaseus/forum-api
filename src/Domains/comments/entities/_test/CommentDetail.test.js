const CommentDetail = require('../CommentDetail');

describe('a CommentDetail entity', () => {
  it('should throw error when payload does not contain required property', () => {
    const missingPropErr = 'COMMENT_DETAIL.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY';

    const payloadWithoutId = {
      content: 'isi komentar',
      date: '2025-05-26T06:33:54.598Z',
      username: 'user2',
      isDeleted: false,
      likeCount: 2,
    };
    const payloadWithoutContent = {
      id: '123456',
      date: '2025-05-26T06:33:54.598Z',
      username: 'user2',
      isDeleted: false,
      likeCount: 2,
    };
    const payloadWithoutDate = {
      id: '123456',
      content: 'isi komentar',
      username: 'user2',
      isDeleted: false,
      likeCount: 2,
    };
    const payloadWithoutUsername = {
      id: '123456',
      content: 'isi komentar',
      date: '2025-05-26T06:33:54.598Z',
      isDeleted: false,
      likeCount: 2,
    };
    const payloadWithoutIsDeleted = {
      id: '123456',
      content: 'isi komentar',
      date: '2025-05-26T06:33:54.598Z',
      username: 'user2',
      is_deleted: false,
      likeCount: 2,
    };
    const payloadWithoutLikeCount = {
      id: '123456',
      content: 'isi komentar',
      date: '2025-05-26T06:33:54.598Z',
      username: 'user2',
      isDeleted: false,
    };

    expect(() => new CommentDetail(payloadWithoutId)).toThrow(missingPropErr);
    expect(() => new CommentDetail(payloadWithoutContent)).toThrow(missingPropErr);
    expect(() => new CommentDetail(payloadWithoutDate)).toThrow(missingPropErr);
    expect(() => new CommentDetail(payloadWithoutUsername)).toThrow(missingPropErr);
    expect(() => new CommentDetail(payloadWithoutIsDeleted)).toThrow(missingPropErr);
    expect(() => new CommentDetail(payloadWithoutLikeCount)).toThrow(missingPropErr);
  });

  it('should throw error when payload does not meet data type specification', () => {
    const wrongTypeErr = 'COMMENT_DETAIL.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION';

    const payloadWithBadId = {
      id: 123456,
      content: 'isi komentar',
      date: '2025-05-26T06:33:54.598Z',
      username: 'user2',
      isDeleted: false,
      likeCount: 2,
    };
    const payloadWithBadContent = {
      id: '123456',
      content: ['isi komentar'],
      date: '2025-05-26T06:33:54.598Z',
      username: 'user2',
      isDeleted: false,
      likeCount: 2,
    };
    const payloadWithBadDate = {
      id: '123456',
      content: 'isi komentar',
      date: 20250526,
      username: 'user2',
      isDeleted: false,
      likeCount: 2,
    };
    const payloadWithBadUsername = {
      id: '123456',
      content: 'isi komentar',
      date: '2025-05-26T06:33:54.598Z',
      username: 123,
      isDeleted: false,
      likeCount: 2,
    };
    const payloadWithBadIsDeleted = {
      id: '123456',
      content: 'isi komentar',
      date: '2025-05-26T06:33:54.598Z',
      username: 'user2',
      isDeleted: 'false',
      likeCount: 2,
    };
    const payloadWithBadLikeCount = {
      id: '123456',
      content: 'isi komentar',
      date: '2025-05-26T06:33:54.598Z',
      username: 'user2',
      isDeleted: false,
      likeCount: '2',
    };

    expect(() => new CommentDetail(payloadWithBadId)).toThrow(wrongTypeErr);
    expect(() => new CommentDetail(payloadWithBadContent)).toThrow(wrongTypeErr);
    expect(() => new CommentDetail(payloadWithBadDate)).toThrow(wrongTypeErr);
    expect(() => new CommentDetail(payloadWithBadUsername)).toThrow(wrongTypeErr);
    expect(() => new CommentDetail(payloadWithBadIsDeleted)).toThrow(wrongTypeErr);
    expect(() => new CommentDetail(payloadWithBadLikeCount)).toThrow(wrongTypeErr);
  });

  it('should create CommentDetail object correctly', () => {
    const payload = {
      id: '123456',
      content: 'isi komentar',
      date: '2025-05-26T06:33:54.598Z',
      username: 'user2',
      isDeleted: false,
      likeCount: 2,
    };

    const { id, content, date, username, likeCount } = new CommentDetail(payload);

    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
    expect(likeCount).toEqual(payload.likeCount);
  });

  it('should return content as **komentar telah dihapus** when isDeleted is true', () => {
    const payload = {
      id: '123456',
      content: 'isi komentar',
      date: '2025-05-26T06:33:54.598Z',
      username: 'user2',
      isDeleted: true,
      likeCount: 2,
    };

    const { content } = new CommentDetail(payload);

    expect(content).toEqual('**komentar telah dihapus**');
  });
});
