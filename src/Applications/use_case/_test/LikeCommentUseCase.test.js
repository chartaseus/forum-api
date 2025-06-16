const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentLikeRepository = require('../../../Domains/likes/CommentLikeRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const LikeCommentUseCase = require('../LikeCommentUseCase');

describe('LikeCommentUseCase', () => {
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

    const likeCommentUseCase = new LikeCommentUseCase({});

    await expect(likeCommentUseCase.execute(payloadWithoutCommentId))
      .rejects.toThrow('LIKE_COMMENT_USE_CASE.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY');
    await expect(likeCommentUseCase.execute(payloadWithoutThreadId))
      .rejects.toThrow('LIKE_COMMENT_USE_CASE.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY');
    await expect(likeCommentUseCase.execute(payloadWithoutUserId))
      .rejects.toThrow('LIKE_COMMENT_USE_CASE.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY');
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

    const likeCommentUseCase = new LikeCommentUseCase({});

    await expect(likeCommentUseCase.execute(payloadWithBadCommentId))
      .rejects.toThrow('LIKE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    await expect(likeCommentUseCase.execute(payloadWithBadThreadId))
      .rejects.toThrow('LIKE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    await expect(likeCommentUseCase.execute(payloadWithBadUserId))
      .rejects.toThrow('LIKE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrate like comment action correctly', async () => {
    const useCasePayload = {
      commentId: 'comment-1',
      threadId: 'thread-1',
      userId: 'user-2',
    };

    const mockCommentLikeRepository = new CommentLikeRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.checkThreadExistence = jest.fn(() => Promise.resolve(true));
    mockCommentRepository.checkCommentExistence = jest.fn(() => Promise.resolve(true));
    mockCommentLikeRepository.checkUserLikeOnComment = jest.fn(() => Promise.resolve(false));
    mockCommentLikeRepository.addLike = jest.fn(() => Promise.resolve());
    const deleteLikeSpy = jest.spyOn(mockCommentLikeRepository, 'deleteLike');

    const likeCommentUseCase = new LikeCommentUseCase({
      likeRepository: mockCommentLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await likeCommentUseCase.execute(useCasePayload);

    expect(mockThreadRepository.checkThreadExistence)
      .toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.checkCommentExistence)
      .toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockCommentLikeRepository.checkUserLikeOnComment).toHaveBeenCalledWith({
      commentId: useCasePayload.commentId,
      userId: useCasePayload.userId,
    });
    expect(mockCommentLikeRepository.addLike).toHaveBeenCalledWith({
      commentId: useCasePayload.commentId,
      userId: useCasePayload.userId,
    });
    expect(deleteLikeSpy).toHaveBeenCalledTimes(0);
  });

  it('should orchestrate unlike comment action correctly', async () => {
    const useCasePayload = {
      commentId: 'comment-1',
      threadId: 'thread-1',
      userId: 'user-2',
    };

    const mockCommentLikeRepository = new CommentLikeRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.checkThreadExistence = jest.fn(() => Promise.resolve(true));
    mockCommentRepository.checkCommentExistence = jest.fn(() => Promise.resolve(true));
    mockCommentLikeRepository.checkUserLikeOnComment = jest.fn(() => Promise.resolve(true));
    mockCommentLikeRepository.deleteLike = jest.fn(() => Promise.resolve());
    const addLikeSpy = jest.spyOn(mockCommentLikeRepository, 'addLike');

    const likeCommentUseCase = new LikeCommentUseCase({
      likeRepository: mockCommentLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await likeCommentUseCase.execute(useCasePayload);

    expect(mockThreadRepository.checkThreadExistence)
      .toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.checkCommentExistence)
      .toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockCommentLikeRepository.checkUserLikeOnComment)
      .toHaveBeenCalledWith({
        commentId: useCasePayload.commentId,
        userId: useCasePayload.userId,
      });
    expect(mockCommentLikeRepository.deleteLike)
      .toHaveBeenCalledWith({
        commentId: useCasePayload.commentId,
        userId: useCasePayload.userId,
      });
    expect(addLikeSpy).toHaveBeenCalledTimes(0);
  });
});
