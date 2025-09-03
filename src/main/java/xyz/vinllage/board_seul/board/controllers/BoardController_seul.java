package xyz.vinllage.board_seul.board.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;
import xyz.vinllage.board_seul.board.entities.Board_seul;
import xyz.vinllage.board_seul.board.services.BoardDeleteService_seul;
import xyz.vinllage.board_seul.board.services.BoardInfoService_seul;
import xyz.vinllage.board_seul.board.services.BoardUpdateService_seul;
import xyz.vinllage.board_seul.board.validator.BoardValidator_seul;
import xyz.vinllage.board_seul.controllers.BoardSearch_seul;
import xyz.vinllage.board_seul.post.services.BoardDataInfoService_seul;
import xyz.vinllage.board_seul.post.services.BoardPermissionService_seul;
import xyz.vinllage.global.search.ListData;
import xyz.vinllage.member.constants.Authority;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/board")
@Tag(name="관리자 게시판 API", description = "게시판 설정 관리 API")
public class BoardController_seul {

    private final BoardInfoService_seul configInfoService;
    private final BoardUpdateService_seul configUpdateService;
    private final BoardDataInfoService_seul dataInfoService;
    private final BoardPermissionService_seul permissionService;
    private final BoardValidator_seul validate;
    private final BoardDeleteService_seul deleteService;
    private final HttpServletRequest request;

    /**
     * 게시판 목록 조회
     */
    @Operation(summary = "게시판 목록 조회")
    @GetMapping("/list")
    public ResponseEntity<ListData<Board_seul>> getList(@ModelAttribute BoardSearch_seul search) {
        ListData<Board_seul> data = configInfoService.getList(search);
        return ResponseEntity.ok(data);
    }

    /**
     * 게시판 등록용 기본값 조회
     */
    @Operation(summary = "게시판 등록 폼 기본값")
    @GetMapping("/register/form")
    public ResponseEntity<RequestBoard_seul> getRegisterForm() {
        RequestBoard_seul form = new RequestBoard_seul();
        // 기본값 설정
        form.setSkin("default");
        form.setListAuthority(Authority.ALL);
        form.setViewAuthority(Authority.ALL);
        form.setWriteAuthority(Authority.ALL);
        form.setCommentAuthority(Authority.ALL);
        form.setRowsForPage(20);
        form.setPageCount(10);

        return ResponseEntity.ok(form);
    }

    /**
     * 게시판 등록
     */
    @Operation(summary = "게시판 저장(등록/수정)")
    @RequestMapping(path="/save", method={RequestMethod.POST, RequestMethod.PATCH})
    public ResponseEntity<?> register(@Valid @RequestBody RequestBoard_seul form, Errors errors) {
        String mode = request.getMethod().equalsIgnoreCase("PATCH") ? "update":"register";
        form.setMode(mode);

        validate.validate(form, errors);
        if (errors.hasErrors()) {
            return ResponseEntity.badRequest().body(getErrorResponse(errors));
        }

        configUpdateService.process(form);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "success", true,
                "message", "게시판이 등록되었습니다."
        ));
    }

    /**
     * 게시판 수정용 데이터 조회
     */
    @Operation(summary = "게시판 수정 폼 데이터")
    @GetMapping("/update/{bid}")
    public ResponseEntity<RequestBoard_seul> getUpdateForm(@PathVariable("bid") String bid) {
        RequestBoard_seul form = configInfoService.getForm(bid);
        form.setMode("update");
        form.setWritable(permissionService.authCheck(form.getWriteAuthority()));
        return ResponseEntity.ok(form);
    }

    /**
     * 게시판 수정
     */
    @Operation(summary = "게시판 수정")
    @PutMapping("/update/register/{bid}")
    public ResponseEntity<?> update(
            @PathVariable("bid") String bid,
            @Valid @RequestBody RequestBoard_seul form,
            Errors errors) {

        form.setBid(bid);
        form.setMode("update");

        validate.validate(form, errors);
        if (errors.hasErrors()) {
            return ResponseEntity.badRequest().body(getErrorResponse(errors));
        }

        configUpdateService.process(form);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "게시판이 수정되었습니다."
        ));
    }

    @Operation(summary = "게시판 삭제")
    @PutMapping("/delete")
    public ResponseEntity<?> delete(
            @Valid @RequestBody RequestBoard_seul form,
            Errors errors) {

        deleteService.delete(form.getBid());

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "게시판이 삭제되었습니다."
        ));
    }

    /**
     * 에러 응답 생성
     */
    private Map<String, Object> getErrorResponse(Errors errors) {
        List<String> errorMessages = errors.getAllErrors().stream()
                .map(error -> error.getDefaultMessage())
                .collect(Collectors.toList());

        return Map.of(
                "success", false,
                "message", "입력값 검증에 실패했습니다.",
                "errors", errorMessages
        );
    }
}
