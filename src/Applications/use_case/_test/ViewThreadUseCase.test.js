const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentDetail = require('../../../Domains/comments/entities/CommentDetail');
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
    });
    const comment2 = new CommentDetail({
      id: 'comment-2',
      content: 'isi komentar',
      date: '2025-05-26T06:35:54.598Z',
      username: 'user1',
      isDeleted: true,
    });
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.checkThreadExistence = jest.fn(() => Promise.resolve(true));
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(threadDetail));
    mockCommentRepository.getThreadComments = jest.fn(() => Promise.resolve([comment1, comment2]));

    const viewThreadUseCase = new ViewThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const thread = await viewThreadUseCase.execute({ threadId });

    expect(mockThreadRepository.checkThreadExistence).toHaveBeenCalledWith(threadId);
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.getThreadComments).toHaveBeenCalledWith(threadId);
    expect(thread.id).toEqual(threadDetail.id);
    expect(thread.title).toEqual(threadDetail.title);
    expect(thread.body).toEqual(threadDetail.body);
    expect(thread.date).toEqual(threadDetail.date);
    expect(thread.username).toEqual(threadDetail.username);
    expect(thread.comments).toStrictEqual([comment1, comment2]);
  });
});
