const CommentRepository = require('../../../Domains/comments/CommentRepository');
const PostedComment = require('../../../Domains/comments/entities/PostedComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');
const PostComment = require('../../../Domains/comments/entities/PostComment');

describe('AddCommentUseCase', () => {
  it('should orchestrate adding comment action correctly', async () => {
    const useCasePayload = {
      content: 'isi komentar',
      threadId: 'thread-1',
      userId: 'user-1',
    };
    const mockPostedComment = new PostedComment({
      id: 'comment-1',
      body: useCasePayload.content,
      owner: useCasePayload.userId,
    });

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockCommentRepository.addComment = jest.fn(() => Promise.resolve(mockPostedComment));
    mockThreadRepository.checkThreadExistence = jest.fn(() => Promise.resolve(true));

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const addedComment = await addCommentUseCase.execute(useCasePayload);

    expect(addedComment).toStrictEqual(new PostedComment({
      id: 'comment-1',
      body: useCasePayload.content,
      owner: useCasePayload.userId,
    }));
    expect(mockCommentRepository.addComment).toHaveBeenCalledWith(new PostComment({
      content: useCasePayload.content,
      userId: useCasePayload.userId,
      threadId: useCasePayload.threadId,
    }));
    expect(mockThreadRepository.checkThreadExistence).toHaveBeenCalledWith(useCasePayload.threadId);
  });
});
