package xyz.vinllage.board_seul.post.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;
import xyz.vinllage.board_seul.board.entities.Board_seul;
import xyz.vinllage.board_seul.board.services.BoardInfoService_seul;
import xyz.vinllage.board_seul.controllers.BoardSearch_seul;
import xyz.vinllage.board_seul.post.entities.BoardData_seul;
import xyz.vinllage.board_seul.post.services.BoardDataDeleteService_seul;
import xyz.vinllage.board_seul.post.services.BoardDataInfoService_seul;
import xyz.vinllage.board_seul.post.services.BoardDataUpdateService_seul;
import xyz.vinllage.board_seul.post.services.BoardPermissionService_seul;
import xyz.vinllage.global.exceptions.BadRequestException;
import xyz.vinllage.global.search.ListData;
import xyz.vinllage.member.libs.MemberUtil;
import xyz.vinllage.member.services.MemberSessionService;

import java.util.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/board")
public class BoardDataController_seul {

    private final MemberUtil memberUtil;
    private final BoardDataInfoService_seul infoService;
    private final BoardPermissionService_seul permissionService;
    private final BoardInfoService_seul configInfoService;
    private final BoardDataUpdateService_seul updateService;
    private final BoardDataDeleteService_seul deleteService;
    private final MemberSessionService session;

    // 게시글 목록 조회
    @GetMapping("/list/{bid}")
    public ListData<BoardData_seul> getList(@PathVariable("bid") String bid, @ModelAttribute BoardSearch_seul search) {
        try {
            search.setBid(bid);
            Board_seul board = configInfoService.get(bid);
            if (board == null) {
                return null;
            }

            ListData<BoardData_seul> data = infoService.getList(search);

            return data;
        } catch (Exception e) {
            return null;
        }
    }

    // 게시글 작성 폼 데이터 조회
    @GetMapping("/write/{bid}")
    public ResponseEntity<RequestBoardData_seul> getWriteForm(@PathVariable("bid") String bid) {
        try {
            Board_seul board = configInfoService.get(bid);
            if (board == null) {
                return ResponseEntity.notFound().build();
            }

            if (!permissionService.canAccess(board)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            RequestBoardData_seul form = new RequestBoardData_seul();
            form.setBid(bid);
            form.setGid(UUID.randomUUID().toString());

            if (memberUtil.isLogin()) {
                form.setPoster(memberUtil.getMember().getName());
            } else {
                form.setGuest(true);
            }

            return ResponseEntity.ok(form);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // 게시글 저장
    @RequestMapping(path="/save", method={RequestMethod.POST, RequestMethod.PATCH})
    public ResponseEntity<?> save(@Valid @RequestBody RequestBoardData_seul form, Errors errors) {
        try {
            String mode = StringUtils.hasText(form.getMode()) ? form.getMode() : "register";
            form.setMode(mode);

            if (errors.hasErrors()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "입력값 검증에 실패했습니다.");

                Map<String, String> fieldErrors = new HashMap<>();
                errors.getFieldErrors().forEach(error ->
                        fieldErrors.put(error.getField(), error.getDefaultMessage())
                );
                errorResponse.put("errors", fieldErrors);

                return ResponseEntity.badRequest().body(errorResponse);
            }

            updateService.process(form);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", mode.equals("update") ? "글이 수정되었습니다." : "글이 등록되었습니다.",
                    "data", form
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "글 저장에 실패했습니다."
            ));
        }
    }

    // 게시글 상세 조회
    @GetMapping("/view/{seq}")
    public BoardData_seul view(@PathVariable("seq") Long seq) {
        try {
            BoardData_seul boardData = infoService.get(seq);
            if (boardData == null) {
                System.out.println("실패");
                return null;
            }
            setPermissions(boardData);

            return boardData;

        } catch (Exception e) {
            return null;
        }
    }

    // 게시글 수정 폼 데이터 조회
    @GetMapping("/update/{seq}")
    public BoardData_seul getUpdateForm(@PathVariable("seq") Long seq, HttpSession session) {
        try {
            BoardData_seul boardData = infoService.get(seq);
            if (boardData == null) {
                return null;
            }
            setPermissions(boardData);

            if (!permissionService.canEdit(boardData)) {
                System.out.println(boardData);
                return null;
            }

            return boardData;
        } catch (Exception e) {
            return null;
        }
    }

    @DeleteMapping("/delete/{seq}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable("seq") Long seq, HttpServletRequest request) {
        try {
            BoardData_seul boardData = infoService.get(seq);
            if (boardData == null) {
                return ResponseEntity.notFound().build();
            }

            setPermissions(boardData);

            if (!boardData.isCanDelete()) {
                System.out.println("지울 수 없음!");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            String bid = boardData.getBoard().getBid();
            deleteService.delete(seq);

            return ResponseEntity.ok(Map.of(
                    "message", "삭제 완료",
                    "bid", bid
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    private void setPermissions(BoardData_seul boardData) {
        boardData.setCanEdit(permissionService.canEdit(boardData));
        boardData.setCanDelete(permissionService.canDelete(boardData));
        boardData.setGuest(boardData.getMember() == null);
        boardData.setMine(permissionService.memberOrGuest(boardData));
        boardData.setNeedAuth(permissionService.needAuth(boardData));
        boardData.setCommentable(permissionService.commentCheck((boardData.getBoard())));
    }

}
