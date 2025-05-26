const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should throw error when payload missing required properties', async () => {
    const payloadWithoutCommentId = {
      threadId: 'thread-1',
      userId: 'user-2',
    };
    const payloadWithoutThreadId = {
      commentId: 'comment-1',
      userId: 'user-2',
    };
    const payloadWithoutUserId = {
      commentId: 'comment-1',
      threadId: 'thread-1',
    };

    const deleteCommentUseCase = new DeleteCommentUseCase({});

    await expect(deleteCommentUseCase.execute(payloadWithoutCommentId))
      .rejects.toThrow('DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY');
    await expect(deleteCommentUseCase.execute(payloadWithoutThreadId))
      .rejects.toThrow('DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY');
    await expect(deleteCommentUseCase.execute(payloadWithoutUserId))
      .rejects.toThrow('DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', async () => {
    const payloadWithBadCommentId = {
      commentId: 123,
      threadId: 'thread-1',
      userId: 'user-2',
    };
    const payloadWithBadThreadId = {
      commentId: 'comment-1',
      threadId: true,
      userId: 'user-2',
    };
    const payloadWithBadUserId = {
      commentId: 'comment-1',
      threadId: 'thread-1',
      userId: Infinity,
    };

    const deleteCommentUseCase = new DeleteCommentUseCase({});

    await expect(deleteCommentUseCase.execute(payloadWithBadCommentId))
      .rejects.toThrow('DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    await expect(deleteCommentUseCase.execute(payloadWithBadThreadId))
      .rejects.toThrow('DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    await expect(deleteCommentUseCase.execute(payloadWithBadUserId))
      .rejects.toThrow('DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrate delete comment action correctly', async () => {
    const useCasePayload = {
      commentId: 'comment-1',
      threadId: 'thread-1',
      userId: 'user-2',
    };

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.checkThreadExistence = jest.fn(() => Promise.resolve());
    mockCommentRepository.checkCommentExistence = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest.fn(() => Promise.resolve());
    mockCommentRepository.softDeleteComment = jest.fn(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await deleteCommentUseCase.execute(useCasePayload);

    expect(mockThreadRepository.checkThreadExistence)
      .toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.checkCommentExistence)
      .toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockCommentRepository.verifyCommentOwner)
      .toHaveBeenCalledWith({
        commentId: useCasePayload.commentId,
        userId: useCasePayload.userId,
      });
    expect(mockCommentRepository.softDeleteComment)
      .toHaveBeenCalledWith(useCasePayload.commentId);
  });
});
