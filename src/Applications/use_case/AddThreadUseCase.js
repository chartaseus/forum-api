const PostThread = require('../../Domains/threads/entities/PostThread');

class AddThreadUseCase {
  constructor(threadRepository) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    // create valid payload object
    const postThread = new PostThread(useCasePayload);

    // add thread to database
    const postedThread = await this._threadRepository.addThread(postThread);

    // return data for response body
    return postedThread;
  }
}

module.exports = AddThreadUseCase;
