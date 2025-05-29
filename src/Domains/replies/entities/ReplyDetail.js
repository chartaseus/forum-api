class ReplyDetail {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, username, date, content, commentId, isDeleted } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.commentId = commentId;
    this.content = isDeleted ? '**balasan telah dihapus**' : content;
  }

  _verifyPayload({ id, username, date, content, commentId, isDeleted }) {
    if (!id
      || !date
      || !username
      || !content
      || !commentId
      || isDeleted == undefined) {
      throw new Error('REPLY_DETAIL.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string'
      || typeof username !== 'string'
      || typeof date !== 'string'
      || typeof content !== 'string'
      || typeof commentId !== 'string'
      || typeof isDeleted !== 'boolean') {
      throw new Error('REPLY_DETAIL.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = ReplyDetail;
