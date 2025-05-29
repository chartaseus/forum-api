class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const useCasePayload = { userId, ...request.payload, ...request.params };
    const addReplyUseCase = this._container.getInstance('AddReplyUseCase');
    const addedReply = await addReplyUseCase.execute(useCasePayload);

    const response = h.response({
      status: 'success',
      data: { addedReply },
    });
    response.created();
    return response;
  }

  async deleteReplyHandler(request) {
    const { id: userId } = request.auth.credentials;
    const useCasePayload = { userId, ...request.params };
    const deleteReplyUseCase = this._container.getInstance('DeleteReplyUseCase');
    await deleteReplyUseCase.execute(useCasePayload);

    return { status: 'success' };
  }
}

module.exports = RepliesHandler;
