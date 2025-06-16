const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentDetail = require('../../../Domains/comments/entities/CommentDetail');
const ReplyDetail = require('../../../Domains/replies/entities/ReplyDetail');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ViewThreadUseCase = require('../ViewThreadUseCase');

describe('ViewThreadUseCase', () => {
  it('should orchestrate viewing thread action correctly', async () => {
    const threadId = 'thread-viewthreadtest';
    const threadDetail = new ThreadDetail({
      id: threadId,
      title: 'judul thread',
      body: 'isi thread',
      date: '2025-05-26T06:33:54.598Z',
      username: 'user1',
    });
    const comment1 = new CommentDetail({
      id: 'comment-1',
      content: 'isi komentar',
      date: '2025-05-26T06:34:54.598Z',
      username: 'user2',
      isDeleted: false,
      likeCount: 2,
    });
    const comment2 = new CommentDetail({
      id: 'comment-2',
      content: 'isi komentar',
      date: '2025-05-26T06:35:54.598Z',
      username: 'user1',
      isDeleted: true,
      likeCount: 1,
    });
    const reply1 = new ReplyDetail({
      id: 'reply-1-1',
      content: 'isi balasan',
      date: '2025-05-26T06:36:54.598Z',
      username: 'user1',
      commentId: 'comment-1',
      isDeleted: false,
    });
    const reply2 = new ReplyDetail({
      id: 'reply-2-1',
      content: 'isi balasan',
      date: '2025-05-26T06:37:54.598Z',
      username: 'user2',
      commentId: 'comment-2',
      isDeleted: false,
    });
    const reply3 = new ReplyDetail({
      id: 'reply-2-2',
      content: 'isi balasan',
      date: '2025-05-26T06:38:54.598Z',
      username: 'user1',
      commentId: 'comment-2',
      isDeleted: false,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.checkThreadExistence = jest.fn(() => Promise.resolve(true));
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(threadDetail));
    mockCommentRepository.getThreadComments = jest.fn(() => Promise.resolve([comment1, comment2]));
    mockReplyRepository.getThreadReplies = jest.fn(() => Promise.resolve([reply1, reply2, reply3]));

    const viewThreadUseCase = new ViewThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const thread = await viewThreadUseCase.execute({ threadId });

    expect(thread).toEqual({
      id: 'thread-viewthreadtest',
      title: 'judul thread',
      body: 'isi thread',
      date: '2025-05-26T06:33:54.598Z',
      username: 'user1',
      comments: [
        {
          id: 'comment-1',
          content: 'isi komentar',
          date: '2025-05-26T06:34:54.598Z',
          username: 'user2',
          likeCount: 2,
          replies: [
            {
              id: 'reply-1-1',
              content: 'isi balasan',
              date: '2025-05-26T06:36:54.598Z',
              username: 'user1',
            },
          ],
        },
        {
          id: 'comment-2',
          content: '**komentar telah dihapus**',
          date: '2025-05-26T06:35:54.598Z',
          username: 'user1',
          likeCount: 1,
          replies: [
            {
              id: 'reply-2-1',
              content: 'isi balasan',
              date: '2025-05-26T06:37:54.598Z',
              username: 'user2',
            },
            {
              id: 'reply-2-2',
              content: 'isi balasan',
              date: '2025-05-26T06:38:54.598Z',
              username: 'user1',
            },
          ],
        },
      ],
    });
    expect(mockThreadRepository.checkThreadExistence).toHaveBeenCalledWith(threadId);
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.getThreadComments).toHaveBeenCalledWith(threadId);
    expect(mockReplyRepository.getThreadReplies).toHaveBeenCalledWith(threadId);
  });
});
