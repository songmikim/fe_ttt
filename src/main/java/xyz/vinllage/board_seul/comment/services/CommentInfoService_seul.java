package xyz.vinllage.board_seul.comment.services;

import com.querydsl.core.BooleanBuilder;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import xyz.vinllage.board_seul.comment.entities.Comment_seul;
import xyz.vinllage.board_seul.comment.entities.QComment_seul;
import xyz.vinllage.board_seul.comment.repositories.CommentRepository_seul;
import xyz.vinllage.board_seul.controllers.BoardSearch_seul;
import xyz.vinllage.board_seul.repositories.BaseRepository_seul;
import xyz.vinllage.board_seul.services.InfoService;
import xyz.vinllage.member.libs.MemberUtil;

@Lazy
@Service
@Transactional
public class CommentInfoService_seul extends InfoService<Comment_seul, Long>{

    private final CommentRepository_seul repository;
    private final MemberUtil memberUtil;
    private final ModelMapper mapper;
    private final CommentPermissionService_seul permission;

    public CommentInfoService_seul(HttpServletRequest request, CommentRepository_seul repository, MemberUtil memberUtil, ModelMapper mapper, CommentPermissionService_seul permission) {
        super(request);
        this.repository = repository;
        this.memberUtil = memberUtil;
        this.mapper = mapper;
        this.permission = permission;
    }

    @Override
    protected BaseRepository_seul<Comment_seul, Long> getRepository() {
        return repository;
    }




    // 필터링해서 특정 게시글에 달린 댓글만
    @Override
    protected BooleanBuilder search(BoardSearch_seul search) {
        BooleanBuilder andBuilder = new BooleanBuilder();
        QComment_seul comment = QComment_seul.comment_seul;

        //특정 seq의 게시글에 달린 댓글만
        andBuilder.and(comment.boardDataSeq.eq(search.getSeq()));
        //deletedAt 필터링
        andBuilder.and(comment.deletedAt.isNull());

        return andBuilder;
    }

    // 후처리
    @Override
    public void addInfo(Comment_seul item)
    {
        item.setCanDelete(permission.canEdit(item));
        item.setNeedAuth(permission.needAuth(item));
    }
}
