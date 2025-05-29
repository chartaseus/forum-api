const PostedThread = require('../../../Domains/threads/entities/PostedThread');
const PostThread = require('../../../Domains/threads/entities/PostThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrate adding thread action correctly', async () => {
    const useCasePayload = {
      title: 'a thread',
      body: 'thread body',
      userId: 'user-1',
    };
    const mockPostedThread = new PostedThread({
      id: 'thread-1',
      title: useCasePayload.title,
      owner: 'user-1',
    });

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.addThread = jest.fn(() => Promise.resolve(mockPostedThread));

    const addThreadUseCase = new AddThreadUseCase(mockThreadRepository);

    const addedThread = await addThreadUseCase.execute(useCasePayload);

    expect(addedThread).toStrictEqual(new PostedThread({
      id: 'thread-1',
      title: useCasePayload.title,
      owner: 'user-1',
    }));
    expect(mockThreadRepository.addThread).toHaveBeenCalledWith(new PostThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
      userId: useCasePayload.userId,
    }));
  });
});
