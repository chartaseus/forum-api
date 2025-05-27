class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const useCasePayload = { ...request.payload, userId };
    const addThreadUseCase = this._container.getInstance('AddThreadUseCase');
    const addedThread = await addThreadUseCase.execute(useCasePayload);

    const response = h.response({
      status: 'success',
      data: { addedThread },
    });
    response.code(201);
    return response;
  }

  async getThreadHandler(request) {
    const useCasePayload = request.params;
    const viewThreadUseCase = this._container.getInstance('ViewThreadUseCase');
    const thread = await viewThreadUseCase.execute(useCasePayload);

    return {
      status: 'success',
      data: { thread },
    };
  }
}

module.exports = ThreadsHandler;
