const ReplyDetail = require('../ReplyDetail');

describe('a ReplyDetail entity', () => {
  it('should throw error when payload does not contain required property', () => {
    const missingPropErr = 'REPLY_DETAIL.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY';

    const payloadWithoutId = {
      content: 'isi balasan',
      date: '2025-05-26T06:33:54.598Z',
      username: 'user2',
      commentId: 'comment-1',
      isDeleted: false,
    };
    const payloadWithoutContent = {
      id: '123456',
      date: '2025-05-26T06:33:54.598Z',
      username: 'user2',
      commentId: 'comment-1',
      isDeleted: false,
    };
    const payloadWithoutDate = {
      id: '123456',
      content: 'isi balasan',
      username: 'user2',
      commentId: 'comment-1',
      isDeleted: false,
    };
    const payloadWithoutUsername = {
      id: '123456',
      content: 'isi balasan',
      date: '2025-05-26T06:33:54.598Z',
      commentId: 'comment-1',
      isDeleted: false,
    };
    const payloadWithoutIsDeleted = {
      id: '123456',
      content: 'isi balasan',
      date: '2025-05-26T06:33:54.598Z',
      username: 'user2',
      commentId: 'comment-1',
      is_deleted: false,
    };
    const payloadWithoutCommentId = {
      id: '123456',
      content: 'isi balasan',
      date: '2025-05-26T06:33:54.598Z',
      username: 'user2',
      isDeleted: false,
    };

    expect(() => new ReplyDetail(payloadWithoutId)).toThrow(missingPropErr);
    expect(() => new ReplyDetail(payloadWithoutContent)).toThrow(missingPropErr);
    expect(() => new ReplyDetail(payloadWithoutDate)).toThrow(missingPropErr);
    expect(() => new ReplyDetail(payloadWithoutUsername)).toThrow(missingPropErr);
    expect(() => new ReplyDetail(payloadWithoutCommentId)).toThrow(missingPropErr);
    expect(() => new ReplyDetail(payloadWithoutIsDeleted)).toThrow(missingPropErr);
  });

  it('should throw error when payload does not meet data type specification', () => {
    const wrongTypeErr = 'REPLY_DETAIL.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION';

    const payloadWithBadId = {
      id: 123456,
      content: 'isi balasan',
      date: '2025-05-26T06:33:54.598Z',
      username: 'user2',
      commentId: 'comment-1',
      isDeleted: false,
    };
    const payloadWithBadContent = {
      id: '123456',
      content: ['isi balasan'],
      date: '2025-05-26T06:33:54.598Z',
      username: 'user2',
      commentId: 'comment-1',
      isDeleted: false,
    };
    const payloadWithBadDate = {
      id: '123456',
      content: 'isi balasan',
      date: 20250526,
      username: 'user2',
      commentId: 'comment-1',
      isDeleted: false,
    };
    const payloadWithBadUsername = {
      id: '123456',
      content: 'isi balasan',
      date: '2025-05-26T06:33:54.598Z',
      username: 123,
      commentId: 'comment-1',
      isDeleted: false,
    };
    const payloadWithBadCommentId = {
      id: '123456',
      content: 'isi balasan',
      date: '2025-05-26T06:33:54.598Z',
      username: 'user2',
      commentId: 1,
      isDeleted: false,
    };
    const payloadWithBadIsDeleted = {
      id: '123456',
      content: 'isi balasan',
      date: '2025-05-26T06:33:54.598Z',
      username: 'user2',
      commentId: 'comment-1',
      isDeleted: 'false',
    };

    expect(() => new ReplyDetail(payloadWithBadId)).toThrow(wrongTypeErr);
    expect(() => new ReplyDetail(payloadWithBadContent)).toThrow(wrongTypeErr);
    expect(() => new ReplyDetail(payloadWithBadDate)).toThrow(wrongTypeErr);
    expect(() => new ReplyDetail(payloadWithBadUsername)).toThrow(wrongTypeErr);
    expect(() => new ReplyDetail(payloadWithBadCommentId)).toThrow(wrongTypeErr);
    expect(() => new ReplyDetail(payloadWithBadIsDeleted)).toThrow(wrongTypeErr);
  });

  it('should create ReplyDetail object correctly', () => {
    const payload = {
      id: '123456',
      content: 'isi balasan',
      date: '2025-05-26T06:33:54.598Z',
      username: 'user2',
      commentId: 'comment-1',
      isDeleted: false,
    };

    const { id, content, date, username, commentId } = new ReplyDetail(payload);

    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
    expect(commentId).toEqual(payload.commentId);
  });

  it('should return content as **balasan telah dihapus** when isDeleted is true', () => {
    const payload = {
      id: '123456',
      content: 'isi balasan',
      date: '2025-05-26T06:33:54.598Z',
      username: 'user2',
      commentId: 'comment-1',
      isDeleted: true,
    };

    const { content } = new ReplyDetail(payload);

    expect(content).toEqual('**balasan telah dihapus**');
  });
});
