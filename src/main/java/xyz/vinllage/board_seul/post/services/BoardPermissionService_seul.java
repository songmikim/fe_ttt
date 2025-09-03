package xyz.vinllage.board_seul.post.services;

import org.springframework.stereotype.Service;
import xyz.vinllage.board_seul.board.entities.Board_seul;
import xyz.vinllage.board_seul.post.entities.BoardData_seul;
import xyz.vinllage.board_seul.services.PermissionService;
import xyz.vinllage.global.search.ListData;
import xyz.vinllage.member.constants.Authority;
import xyz.vinllage.member.libs.MemberUtil;

import java.util.List;

@Service
public class BoardPermissionService_seul extends PermissionService<BoardData_seul> {


    public BoardPermissionService_seul(MemberUtil memberUtil) {
        super(memberUtil);
    }

    @Override
    public boolean canAccess(BoardData_seul boardData){
        Authority auth=boardData.getBoard().getWriteAuthority();
        return authCheck(auth);
    }

    public boolean canAccess(Board_seul board){
        Authority auth=board.getWriteAuthority();
        return authCheck(auth);
    }


    public boolean commentCheck(Board_seul board){
        Authority auth=board.getCommentAuthority();
        return authCheck(auth);
    }

}
