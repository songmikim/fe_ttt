package xyz.vinllage.board_seul.post.controllers;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import xyz.vinllage.board_seul.controllers.BaseRequest_seul;
import xyz.vinllage.file.entities.FileInfo;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class RequestBoardData_seul extends BaseRequest_seul {
    private String mode;
    private String guestPw;
    private Long seq;

    @NotBlank
    private String bid;

    @NotBlank
    private String gid;

    private String category;

    @NotBlank
    private String poster;

    @NotBlank
    private String subject;

    @NotBlank
    private String content;

    private boolean guest; // 비회원 게시글 작성, 수정 여부

    private List<FileInfo> editorImages;
    private List<FileInfo> attachFiles;
}