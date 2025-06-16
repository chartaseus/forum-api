class CommentDetail {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, username, date, content, isDeleted, likeCount } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = isDeleted ? '**komentar telah dihapus**' : content;
    this.likeCount = likeCount;
  }

  _verifyPayload({ id, username, date, content, isDeleted, likeCount }) {
    if (!id
      || !date
      || !username
      || !content
      || isDeleted == undefined
      || likeCount == undefined) {
      throw new Error('COMMENT_DETAIL.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string'
      || typeof username !== 'string'
      || typeof date !== 'string'
      || typeof content !== 'string'
      || typeof isDeleted !== 'boolean'
      || typeof likeCount !== 'number') {
      throw new Error('COMMENT_DETAIL.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CommentDetail;
