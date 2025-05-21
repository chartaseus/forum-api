class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const { threadId } = request.params;
    const useCasePayload = { ...request.payload, userId, threadId };
    const addCommentUseCase = this._container.getInstance('AddCommentUseCase');
    const addedComment = await addCommentUseCase.execute(useCasePayload);

    const response = h.response({
      status: 'success',
      data: { addedComment },
    });
    response.created();
    return response;
  }
}

module.exports = CommentsHandler;
