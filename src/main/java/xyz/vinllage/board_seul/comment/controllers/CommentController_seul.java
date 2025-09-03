package xyz.vinllage.board_seul.comment.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.ui.Model;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;
import xyz.vinllage.board_seul.board.services.BoardInfoService_seul;
import xyz.vinllage.board_seul.comment.entities.Comment_seul;
import xyz.vinllage.board_seul.comment.services.CommentDeleteService_seul;
import xyz.vinllage.board_seul.comment.services.CommentInfoService_seul;
import xyz.vinllage.board_seul.comment.services.CommentPermissionService_seul;
import xyz.vinllage.board_seul.comment.services.CommentUpdateService_seul;
import xyz.vinllage.board_seul.controllers.BoardSearch_seul;
import xyz.vinllage.board_seul.post.entities.BoardData_seul;
import xyz.vinllage.board_seul.post.services.BoardDataInfoService_seul;
import xyz.vinllage.global.exceptions.BadRequestException;
import xyz.vinllage.global.search.ListData;
import xyz.vinllage.member.constants.Authority;

@RestController
@RequestMapping("/api/v1/comment")
@RequiredArgsConstructor
public class CommentController_seul {

    private final CommentInfoService_seul infoService;
    private final CommentUpdateService_seul updateService;
    private final BoardDataInfoService_seul dataInfoService;
    private final BoardInfoService_seul boardInfoService;
    private final CommentDeleteService_seul deleteService;
    private final CommentPermissionService_seul permissionService;

    @Operation(summary = "게시글 하나에 있는 댓글 목록", method = "GET", description = "/comments/게시글 등록번호, 게시글 하나에 작성된 댓글 목록")
    @Parameter(name="seq", required = true, in = ParameterIn.PATH, description = "게시글 등록 번호")
    @GetMapping("/comments/{seq}")
    public ListData<Comment_seul> comments(@PathVariable("seq") Long seq) {
        BoardData_seul boardData = dataInfoService.get(seq);
        //댓글 기능 체크
        if (!boardData.getBoard().isComment()) {
            return null;
        }
        // 2. 댓글 권한 체크
        Authority commentAuth = boardData.getBoard().getCommentAuthority();
        if (!permissionService.authCheck(commentAuth)) {
            return null;
        }

        // 3. 댓글 목록 조회
        BoardSearch_seul search = new BoardSearch_seul();
        search.setSeq(seq);
        ListData<Comment_seul> commentList = infoService.getList(search);

        // 4. 각 댓글에 권한 정보 설정
        for (Comment_seul comment : commentList.getItems()) {;
            comment.setCanDelete(permissionService.canDelete(comment));
            comment.setNeedAuth(permissionService.needAuth(comment));
        }

        return commentList;

    }

    @Operation(summary = "댓글 등록", method = "POST", description = "게시글(seq)에다가 댓글 등록")
    @Parameter(name="seq", required = true, in = ParameterIn.PATH, description = "댓글 등록")
    @ApiResponse(responseCode = "204")
    @PostMapping("/comment/{seq}")
    public void comment(
            @PathVariable("seq") Long seq,  // seq 매개변수 추가
            @Valid @RequestBody RequestComment_seul form,
            Errors errors
    ) {
        if (errors.hasErrors()) {
            throw new BadRequestException();
        }

        // 권한 체크도 필요
        BoardData_seul boardData = dataInfoService.get(seq);
        if (!permissionService.authCheck(boardData.getBoard().getCommentAuthority())) {
            throw new BadRequestException("댓글 작성 권한이 없습니다.");
        }

        form.setBoardDataSeq(seq);
        updateService.process(form);
    }

    @Operation(summary = "댓글 한개 삭제 처리", method = "DELETE", description = "댓글 등록번호(seq)로 댓글 한개 삭제")
    @Parameter(name="seq", required = true, in = ParameterIn.PATH, description = "댓글 등록 번호")
    @ApiResponse(responseCode = "204")
    @DeleteMapping("/comment/{seq}")
    public void commentDelete(@PathVariable("seq") Long seq, Model model) {
        deleteService.delete(seq);
    }

    @Operation(summary = "댓글 한개 가져오기", method = "DELETE", description = "댓글 등록번호(seq)로 댓글 정보 조회")
    @Parameter(name="seq", required = true, in = ParameterIn.PATH, description = "댓글 등록 번호")
    @ApiResponse(responseCode = "200")
    @GetMapping("/comment/{seq}")
    public Comment_seul comment(@PathVariable("seq") Long seq, Model model) {
        return infoService.get(seq);
    }
}
