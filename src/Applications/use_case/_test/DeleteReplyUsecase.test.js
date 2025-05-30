const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should throw error when payload missing required properties', async () => {
    const payloadWithoutReplyId = {
      commentId: 'comment-1',
      threadId: 'thread-1',
      userId: 'user-2',
    };
    const payloadWithoutCommentId = {
      replyId: 'reply-1',
      threadId: 'thread-1',
      userId: 'user-2',
    };
    const payloadWithoutThreadId = {
      replyId: 'reply-1',
      commentId: 'comment-1',
      userId: 'user-2',
    };
    const payloadWithoutUserId = {
      replyId: 'reply-1',
      commentId: 'comment-1',
      threadId: 'thread-1',
    };

    const deleteReplyUseCase = new DeleteReplyUseCase({});

    await expect(deleteReplyUseCase.execute(payloadWithoutReplyId))
      .rejects.toThrow('DELETE_REPLY_USE_CASE.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY');
    await expect(deleteReplyUseCase.execute(payloadWithoutCommentId))
      .rejects.toThrow('DELETE_REPLY_USE_CASE.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY');
    await expect(deleteReplyUseCase.execute(payloadWithoutThreadId))
      .rejects.toThrow('DELETE_REPLY_USE_CASE.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY');
    await expect(deleteReplyUseCase.execute(payloadWithoutUserId))
      .rejects.toThrow('DELETE_REPLY_USE_CASE.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', async () => {
    const payloadWithBadReplyId = {
      replyId: ['reply-1'],
      commentId: 'comment-1',
      threadId: 'thread-1',
      userId: 'user-2',
    };
    const payloadWithBadCommentId = {
      replyId: 'reply-1',
      commentId: 123,
      threadId: 'thread-1',
      userId: 'user-2',
    };
    const payloadWithBadThreadId = {
      replyId: 'reply-1',
      commentId: 'comment-1',
      threadId: true,
      userId: 'user-2',
    };
    const payloadWithBadUserId = {
      replyId: 'reply-1',
      commentId: 'comment-1',
      threadId: 'thread-1',
      userId: Infinity,
    };

    const deleteReplyUseCase = new DeleteReplyUseCase({});

    await expect(deleteReplyUseCase.execute(payloadWithBadReplyId))
      .rejects.toThrow('DELETE_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    await expect(deleteReplyUseCase.execute(payloadWithBadCommentId))
      .rejects.toThrow('DELETE_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    await expect(deleteReplyUseCase.execute(payloadWithBadThreadId))
      .rejects.toThrow('DELETE_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    await expect(deleteReplyUseCase.execute(payloadWithBadUserId))
      .rejects.toThrow('DELETE_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrate delete comment action correctly', async () => {
    const useCasePayload = {
      replyId: 'reply-1',
      commentId: 'comment-1',
      threadId: 'thread-1',
      userId: 'user-2',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.checkThreadExistence = jest.fn(() => Promise.resolve(true));
    mockCommentRepository.checkCommentExistence = jest.fn(() => Promise.resolve(false));
    mockReplyRepository.checkReplyExistence = jest.fn(() => Promise.resolve(true));
    mockReplyRepository.verifyReplyOwner = jest.fn(() => Promise.resolve(true));
    mockReplyRepository.softDeleteReply = jest.fn(() => Promise.resolve({ isDeleted: true }));

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await deleteReplyUseCase.execute(useCasePayload);

    expect(mockThreadRepository.checkThreadExistence)
      .toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.checkCommentExistence)
      .toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockReplyRepository.checkReplyExistence)
      .toHaveBeenCalledWith(useCasePayload.replyId);
    expect(mockReplyRepository.verifyReplyOwner)
      .toHaveBeenCalledWith({
        replyId: useCasePayload.replyId,
        userId: useCasePayload.userId,
      });
    expect(mockReplyRepository.softDeleteReply)
      .toHaveBeenCalledWith(useCasePayload.replyId);
  });
});
