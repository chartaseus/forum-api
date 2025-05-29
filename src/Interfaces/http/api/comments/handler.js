class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const useCasePayload = { userId, ...request.params, ...request.payload };
    const addCommentUseCase = this._container.getInstance('AddCommentUseCase');
    const addedComment = await addCommentUseCase.execute(useCasePayload);

    const response = h.response({
      status: 'success',
      data: { addedComment },
    });
    response.created();
    return response;
  }

  async deleteCommentHandler(request) {
    const { id: userId } = request.auth.credentials;
    const useCasePayload = { userId, ...request.params };
    const deleteCommentUseCase = this._container.getInstance('DeleteCommentUseCase');
    await deleteCommentUseCase.execute(useCasePayload);

    return { status: 'success' };
  }
}

module.exports = CommentsHandler;
