const CommentRepository = require('../../../Domains/comments/CommentRepository');
const PostedReply = require('../../../Domains/replies/entities/PostedReply');
const PostReply = require('../../../Domains/replies/entities/PostReply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
  it('should orchestrate adding reply action correctly', async () => {
    const useCasePayload = {
      content: 'isi balasan',
      threadId: 'thread-1',
      userId: 'user-1',
      commentId: 'comment-1',
    };
    const mockPostedReply = new PostedReply({
      id: 'reply-1',
      content: useCasePayload.content,
      owner: useCasePayload.userId,
    });

    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockReplyRepository.addReply = jest.fn(() => Promise.resolve(mockPostedReply));
    mockCommentRepository.checkCommentExistence = jest.fn(() => Promise.resolve(true));
    mockThreadRepository.checkThreadExistence = jest.fn(() => Promise.resolve(true));

    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const addedReply = await addReplyUseCase.execute(useCasePayload);

    expect(addedReply).toStrictEqual(new PostedReply({
      id: 'reply-1',
      content: useCasePayload.content,
      owner: useCasePayload.userId,
    }));
    expect(mockThreadRepository.checkThreadExistence).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.checkCommentExistence).toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockReplyRepository.addReply).toHaveBeenCalledWith(new PostReply({
      content: useCasePayload.content,
      userId: useCasePayload.userId,
      threadId: useCasePayload.threadId,
      commentId: useCasePayload.commentId,
    }));
  });
});
