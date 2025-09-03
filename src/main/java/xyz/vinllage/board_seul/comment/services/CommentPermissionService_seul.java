package xyz.vinllage.board_seul.comment.services;

import org.springframework.stereotype.Service;
import xyz.vinllage.board_seul.comment.entities.Comment_seul;
import xyz.vinllage.board_seul.post.entities.BoardData_seul;
import xyz.vinllage.board_seul.post.services.BoardDataInfoService_seul;
import xyz.vinllage.board_seul.services.PermissionService;
import xyz.vinllage.global.search.ListData;
import xyz.vinllage.member.libs.MemberUtil;

@Service
public class CommentPermissionService_seul extends PermissionService<Comment_seul> {

    private final BoardDataInfoService_seul boardDataInfoService;

    public CommentPermissionService_seul(MemberUtil memberUtil, BoardDataInfoService_seul boardDataInfoService) {
        super(memberUtil);
        this.boardDataInfoService = boardDataInfoService;
    }

    @Override
    public boolean canAccess(Comment_seul commentSeul){
        BoardData_seul boardData = boardDataInfoService.get(commentSeul.getBoardDataSeq());
        return authCheck(boardData.getCommentAuthority());
    }

    public void canAccess (ListData<Comment_seul> items) {
        items.getItems().forEach(this::canAccess);
    }
}