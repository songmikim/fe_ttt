package xyz.vinllage.board_seul.comment.services;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import xyz.vinllage.board_seul.comment.controllers.RequestComment_seul;
import xyz.vinllage.board_seul.comment.entities.Comment_seul;
import xyz.vinllage.board_seul.comment.repositories.CommentRepository_seul;
import xyz.vinllage.board_seul.repositories.BaseRepository_seul;
import xyz.vinllage.board_seul.services.UpdateService;
import xyz.vinllage.member.libs.MemberUtil;

import java.util.Objects;

@Service
@Transactional
public class CommentUpdateService_seul extends UpdateService<Comment_seul, Long, RequestComment_seul> {
    private final CommentRepository_seul repository;
    private final HttpServletRequest request;
    private final MemberUtil memberUtil;
    private final PasswordEncoder encoder;

    public CommentUpdateService_seul(CommentRepository_seul repository, HttpServletRequest request, MemberUtil memberUtil, PasswordEncoder encoder) {
        this.repository = repository;
        this.request = request;
        this.memberUtil = memberUtil;
        this.encoder = encoder;
    }

    @Override
    protected BaseRepository_seul<Comment_seul, Long> getRepository() {
        return repository;
    }

    @Override
    public Comment_seul beforeProcess(RequestComment_seul item) {
        String mode = Objects.requireNonNullElse(item.getMode(), "register");

        Comment_seul commentSeul = new Comment_seul();
        commentSeul.setBoardDataSeq(item.getBoardDataSeq());
        commentSeul.setPoster(item.getCommenter());
        commentSeul.setContent(item.getContent());
        commentSeul.setIp(request.getRemoteAddr());
        commentSeul.setUa(request.getHeader("User-Agent"));

        if (memberUtil.isLogin()) {
            commentSeul.setMember(memberUtil.getMember());
            commentSeul.setPoster(memberUtil.getMember().getName());
        } else {
            commentSeul.setGuestPw(encoder.encode(item.getGuestPw()));
            commentSeul.setPoster(item.getCommenter());
        }

        return commentSeul;
    }

    @Override
    public void afterProcess(Comment_seul item) {

    }
}
