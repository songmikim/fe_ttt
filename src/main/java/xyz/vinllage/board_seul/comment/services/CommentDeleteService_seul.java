package xyz.vinllage.board_seul.comment.services;

import jakarta.transaction.Transactional;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import xyz.vinllage.board_seul.comment.entities.Comment_seul;
import xyz.vinllage.board_seul.comment.repositories.CommentRepository_seul;
import xyz.vinllage.board_seul.repositories.BaseRepository_seul;
import xyz.vinllage.board_seul.services.DeleteService;
import xyz.vinllage.board_seul.services.InfoService;

@Lazy
@Service
@Transactional
public class CommentDeleteService_seul extends DeleteService<Comment_seul, Long> {
    private final CommentInfoService_seul commentInfoService;
    private final CommentRepository_seul repository;


    public CommentDeleteService_seul(CommentInfoService_seul commentInfoService, CommentRepository_seul repository) {
        this.commentInfoService = commentInfoService;
        this.repository = repository;
    }

    @Override
    protected InfoService<Comment_seul, Long> getInfoService() {
        return commentInfoService;
    }

    @Override
    protected BaseRepository_seul<Comment_seul, Long> getRepository() {
        return repository;
    }

    @Override
    protected String getNotFoundErrorMessage() {
        return "댓글을 찾을 수 없습니다.";
    }
}