const PostedComment = require('../PostedComment');

describe('a PostedComment entity', () => {
  it('should throw error when payload does not contain required property', () => {
    const payloadWithoutId = {
      owner: 'user-2',
      body: 'isi komentar',
    };
    const payloadWithoutBody = {
      id: 'comment-1',
      owner: 'user-2',
    };
    const payloadWithoutOwner = {
      id: 'comment-1',
      body: 'isi komentar',
    };

    expect(() => new PostedComment(payloadWithoutId)).toThrow('POST_COMMENT.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new PostedComment(payloadWithoutBody)).toThrow('POST_COMMENT.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new PostedComment(payloadWithoutOwner)).toThrow('POST_COMMENT.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', () => {
    const payloadWithBadId = {
      id: 11,
      body: 'isi komentar',
      owner: 'user-2',
    };
    const payloadWithBadBody = {
      id: 'comment-1',
      body: Infinity,
      owner: 'user-2',
    };
    const payloadWithBadOwner = {
      id: 'comment-1',
      body: 'isi komentar',
      owner: true,
    };

    expect(() => new PostedComment(payloadWithBadId)).toThrow('POST_COMMENT.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new PostedComment(payloadWithBadBody)).toThrow('POST_COMMENT.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new PostedComment(payloadWithBadOwner)).toThrow('POST_COMMENT.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create postedComment object correctly', () => {
    const payload = {
      id: 'comment-1',
      body: 'isi komentar',
      owner: 'user-2',
    };

    const { id, content, owner } = new PostedComment(payload);

    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.body);
    expect(owner).toEqual(payload.owner);
  });
});
