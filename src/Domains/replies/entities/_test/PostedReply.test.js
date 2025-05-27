const PostedReply = require('../PostedReply');

describe('a PostedReply entity', () => {
  it('should throw error when payload does not contain required property', () => {
    const payloadWithoutId = {
      owner: 'user-2',
      content: 'isi balasan',
    };
    const payloadWithoutContent = {
      id: 'reply-1',
      owner: 'user-2',
    };
    const payloadWithoutOwner = {
      id: 'reply-1',
      content: 'isi balasan',
    };

    expect(() => new PostedReply(payloadWithoutId)).toThrow('POST_REPLY.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new PostedReply(payloadWithoutContent)).toThrow('POST_REPLY.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new PostedReply(payloadWithoutOwner)).toThrow('POST_REPLY.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', () => {
    const payloadWithBadId = {
      id: 11,
      content: 'isi balasan',
      owner: 'user-2',
    };
    const payloadWithBadContent = {
      id: 'reply-1',
      content: Infinity,
      owner: 'user-2',
    };
    const payloadWithBadOwner = {
      id: 'reply-1',
      content: 'isi balasan',
      owner: true,
    };

    expect(() => new PostedReply(payloadWithBadId)).toThrow('POST_REPLY.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new PostedReply(payloadWithBadContent)).toThrow('POST_REPLY.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new PostedReply(payloadWithBadOwner)).toThrow('POST_REPLY.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create PostedReply object correctly', () => {
    const payload = {
      id: 'reply-1',
      content: 'isi balasan',
      owner: 'user-2',
    };

    const { id, content, owner } = new PostedReply(payload);

    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
