
package xyz.vinllage.board_seul.comment.controllers;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import xyz.vinllage.board_seul.controllers.BaseRequest_seul;

@Data
public class RequestComment_seul extends BaseRequest_seul {
    private String mode;
    private String guestPw;
    @NotNull
    private Long boardDataSeq; // 게시글 번호
    private Long seq; // 댓글 seq

    @NotBlank
    private String commenter; // 댓글 작성자

    @NotBlank
    private String content; // 댓글 내용

    private boolean guest; // 비회원 댓글 여부
}