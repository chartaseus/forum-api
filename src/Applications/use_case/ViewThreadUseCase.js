class ViewThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;

    // check thread existence
    await this._threadRepository.checkThreadExistence(threadId);

    // get thread data from database
    const thread = await this._threadRepository.getThreadById(threadId);

    // get comments from database
    const comments = await this._commentRepository.getThreadComments(threadId);

    // add comments as thread property
    thread.comments = comments;

    // return thread object
    return thread;
  }
}

module.exports = ViewThreadUseCase;
