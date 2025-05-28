class ViewThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;

    // check thread existence
    await this._threadRepository.checkThreadExistence(threadId);

    // get thread data from database
    const thread = await this._threadRepository.getThreadById(threadId);

    // get comments from database
    const comments = await this._commentRepository.getThreadComments(threadId);

    // get replies from database
    const replies = await this._replyRepository.getThreadReplies(threadId);

    // add comments to thread and map replies to comments
    thread.comments = this._mapRepliesToComments(comments, replies);

    // return thread object
    return thread;
  }

  _mapRepliesToComments(comments, replies) {
    comments.map((comment) => {
      comment.replies = replies
        .filter((reply) => reply.commentId === comment.id)
        .map((reply) => {
          delete reply.commentId;
          return reply;
        });
    });
    return comments;
  }
}

module.exports = ViewThreadUseCase;
