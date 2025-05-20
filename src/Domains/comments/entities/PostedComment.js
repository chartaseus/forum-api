class PostedComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, body, owner } = payload;

    this.id = id;
    this.content = body;
    this.owner = owner;
  }

  _verifyPayload({ id, body, owner }) {
    if (!id || !body || !owner) {
      throw new Error('POST_COMMENT.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string'
      || typeof body !== 'string'
      || typeof owner !== 'string') {
      throw new Error('POST_COMMENT.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = PostedComment;
