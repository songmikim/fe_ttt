package xyz.vinllage.board_seul.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;
import xyz.vinllage.board_seul.comment.entities.Comment_seul;
import xyz.vinllage.board_seul.comment.services.CommentInfoService_seul;
import xyz.vinllage.board_seul.post.entities.BoardData_seul;
import xyz.vinllage.board_seul.post.services.BoardDataInfoService_seul;
import xyz.vinllage.global.exceptions.BadRequestException;
import xyz.vinllage.global.libs.Utils;
import xyz.vinllage.member.libs.MemberUtil;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/board")
@CrossOrigin(origins = "http://localhost:3000")
public class PasswordController_seul {
    private final BoardDataInfoService_seul infoService;
    private final PasswordEncoder encoder;
    private final CommentInfoService_seul commentInfoService;
    private final MemberUtil memberUtil;
    private final Utils utils;

    // 비회원 비밀번호 확인
    @Operation(summary = "비회원 게시글 또는 댓글의 수정, 삭제 비밀번호 검증", method="POST")
    @ApiResponse(responseCode = "204")
    @Parameter(name="password", required = true, in = ParameterIn.QUERY, description = "비회원 비밀번호")
    @PostMapping({"/password/{seq}", "/password/comment/{commentSeq}"})
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void guestPasswordCheckProcess(@PathVariable(required = false, name="seq")Long seq, @PathVariable(required = false, name="commentSeq") Long commentSeq, @Valid @RequestBody RequestPassword form, Errors errors, HttpServletRequest request) {
        if (errors.hasErrors()) {
            throw new BadRequestException(utils.getErrorMessages(errors));
        }

        String guestPw = null, confirmKey = null;
        if (commentSeq != null) { // 댓글
            Comment_seul item = commentInfoService.get(commentSeq);
            guestPw = item.getGuestPw();
            confirmKey = "comment_seq_" + commentSeq;
        } else { // 게시글
            BoardData_seul item = infoService.get(seq);
            guestPw = item.getGuestPw();
            confirmKey = "board_seq_" + seq;
        }

        if (!encoder.matches(form.getPassword(), guestPw)) {
            throw new BadRequestException(utils.getMessage("비밀번호가_일치하지_않습니다."));
        }

        HttpSession httpSession = request.getSession();
        httpSession.setAttribute(confirmKey, true);
    }
}
