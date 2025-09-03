package xyz.vinllage.board_seul.post.services;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import xyz.vinllage.board_seul.board.entities.Board_seul;
import xyz.vinllage.board_seul.board.repositories.BoardRepository_seul;
import xyz.vinllage.board_seul.board.services.BoardInfoService_seul;
import xyz.vinllage.board_seul.post.controllers.RequestBoardData_seul;
import xyz.vinllage.board_seul.post.entities.BoardData_seul;
import xyz.vinllage.board_seul.post.repositories.BoardDataRepository_seul;
import xyz.vinllage.board_seul.repositories.BaseRepository_seul;
import xyz.vinllage.board_seul.services.UpdateService;
import xyz.vinllage.member.libs.MemberUtil;

@Lazy
@Service
@Transactional
public class BoardDataUpdateService_seul extends UpdateService<BoardData_seul, Long, RequestBoardData_seul> {

    private final BoardDataRepository_seul repository;
    private final BoardInfoService_seul boardInfoServiceSeul;
    private final MemberUtil memberUtil;
    private final HttpServletRequest request;
    private final PasswordEncoder encoder;

    // 생성자
    public BoardDataUpdateService_seul(BoardDataRepository_seul repository,
                                       BoardRepository_seul boardRepositorySeul,
                                       BoardInfoService_seul boardInfoServiceSeul,
                                       MemberUtil memberUtil,
                                       HttpServletRequest request,
                                       PasswordEncoder encoder) {
        this.repository = repository;
        this.boardInfoServiceSeul = boardInfoServiceSeul;
        this.memberUtil = memberUtil;
        this.request = request;
        this.encoder = encoder;
    }

    @Override
    protected BaseRepository_seul<BoardData_seul, Long> getRepository() {
        return repository;
    }

    // 전처리 - RequestBoardData를 받아서 BoardData를 반환
    @Override
    public BoardData_seul beforeProcess(RequestBoardData_seul form) {
        String bid = form.getBid();
        Long seq = form.getSeq();
        String gid = form.getGid();

        // 게시판 설정 보기
        Board_seul boardSeul = boardInfoServiceSeul.get(bid);

        BoardData_seul item = null;
        if (seq != null && seq > 0L && (item = repository.findById(seq).orElse(null)) != null) {
            // 글 수정
            System.out.println("기존 게시글 수정: " + seq);
        } else {
            // 글 등록
            /**
             * 1. 글을 작성한 회원
             * 2. 게시판 설정
             * 3. gid
             * 4. 아이피 정보(ipAddr) & 브라우저 정보(요청 헤더 - User-Agent)
             */
            item = new BoardData_seul();
            item.setBoard(boardSeul);
            item.setGid(gid);
            item.setMember(memberUtil.getMember());
            item.setIp(request.getRemoteAddr());
            item.setUa(request.getHeader("User-Agent"));
            System.out.println("새 게시글 등록");
        }

        // 등록, 수정 공통
        item.setCategory(form.getCategory());
        item.setPoster(form.getPoster());
        item.setSubject(form.getSubject());
        item.setContent(form.getContent());

        if (!memberUtil.isLogin()) {
            item.setGuestPw(encoder.encode(form.getGuestPw()));
        }
        item.setPlainText(!boardSeul.isEditor());

        return item;
    }

    @Override
    public void afterProcess(BoardData_seul item) {
        // 후처리 로직 (예: 파일 정리, 알림 발송 등)
        System.out.println("게시글 처리 완료: " + item.getSubject());
    }
}
