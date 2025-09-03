package xyz.vinllage.board_seul.post.services;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.dsl.StringExpression;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import xyz.vinllage.board_seul.board.controllers.RequestBoard_seul;
import xyz.vinllage.board_seul.controllers.BoardSearch_seul;
import xyz.vinllage.board_seul.post.entities.BoardData_seul;
import xyz.vinllage.board_seul.post.entities.QBoardData_seul;
import xyz.vinllage.board_seul.post.repositories.BoardDataRepository_seul;
import xyz.vinllage.board_seul.repositories.BaseRepository_seul;
import xyz.vinllage.board_seul.services.InfoService;
import xyz.vinllage.file.services.FileInfoService;
import xyz.vinllage.member.entities.Member;
import xyz.vinllage.member.libs.MemberUtil;
import xyz.vinllage.member.services.MemberSessionService;

import java.time.LocalDate;
import java.util.List;

@Lazy
@Service
@Transactional
public class BoardDataInfoService_seul extends InfoService<BoardData_seul, Long>{

    private final BoardDataRepository_seul repository;
    private final ModelMapper mapper;
    private final MemberUtil memberUtil;
    private final MemberSessionService session;
    private final FileInfoService fileInfoService;

    public BoardDataInfoService_seul(HttpServletRequest request,
                                     BoardDataRepository_seul repository, ModelMapper mapper, MemberUtil memberUtil, MemberSessionService session, FileInfoService fileInfoService) {
        super(request);
        this.repository = repository;
        this.mapper=mapper;
        this.memberUtil = memberUtil;
        this.session = session;
        this.fileInfoService = fileInfoService;
    }

    @Override
    protected BaseRepository_seul<BoardData_seul, Long> getRepository() { return repository; }


    /**
     * 게시글 수정시 조회
     * @param seq
     * @return
     */
    public RequestBoard_seul getForm(Long seq) {
        BoardData_seul item = get(seq);
        RequestBoard_seul form = mapper.map(item, RequestBoard_seul.class);
        form.setBid(item.getBoard().getBid());
        return form;
    }

    @Override
    protected BooleanBuilder search(BoardSearch_seul search) {
        /* 검색 조건 처리 S */
        String sopt = search.getSopt();
        String skey = search.getSkey();
        LocalDate sDate = search.getSDate();
        LocalDate eDate = search.getEDate();
        List<String> emails = search.getEmail();
        String bids = search.getBid();

        BooleanBuilder andBuilder = new BooleanBuilder();
        QBoardData_seul boardData = QBoardData_seul.boardData_seul;

        //deletedAt 필터링
        andBuilder.and(boardData.deletedAt.isNull());

        if (bids != null && !bids.isEmpty())  { // 게시판 아이디 조회
            andBuilder.and(boardData.board.bid.in(bids));
        }

        // 게시글 등록일 조회
        if (sDate != null) {
            andBuilder.and(boardData.createdAt.goe(sDate.atStartOfDay()));
        }

        if (eDate != null) {
            andBuilder.and(boardData.createdAt.loe(eDate.atTime(23, 59, 59)));
        }

        List<String> categories = search.getCategory();
        if (categories != null && !categories.isEmpty()) { // 게시판 분류 조회
            andBuilder.and(boardData.category.in(categories));
        }

        /**
         * 키워드 검색
         * sopt - ALL : 통합검색 (SUBJECT + CONTENT + NAME)
         *        SUBJECT : 게시글 제목
         *        CONTENT : 게시글 내용
         *        SUBJECT_CONTENT : 게시글 제목 + 내용
         *        NAME : 작성자명(poster) + 회원명(name) + 이메일(email)
         */
        sopt = StringUtils.hasText(sopt) ? sopt.toUpperCase() : "ALL";
        if (StringUtils.hasText(skey)) {
            skey = skey.trim();

            StringExpression subject = boardData.subject;
            StringExpression content = boardData.content;

            // member가 null일 경우를 고려한 name 필드
            StringExpression name = boardData.poster;

            StringExpression fields = null;
            if (sopt.equals("SUBJECT")) {
                fields = subject;
            } else if (sopt.equals("CONTENT")) {
                fields = content;
            } else if (sopt.equals("SUBJECT_CONTENT")) {
                fields = subject.concat(content);
            } else if (sopt.equals("NAME")) {
                fields = name;
            } else { // 통합검색
                fields = subject.concat(content).concat(name);
            }

            andBuilder.and(fields.contains(skey));
        }

        // 회원 이메일로 게시글 조회
        if (emails != null && !emails.isEmpty()) {
            andBuilder.and(boardData.member.email.in(emails));
        }

        /* 검색 조건 처리 E */

        return andBuilder;
    }

    @Override
    public void addInfo(BoardData_seul item) {
        String gid = item.getGid();

        // 첨부된 이미지 & 파일 목록
        item.setEditorImages(fileInfoService.getList(gid, "editor"));
        item.setAttachFiles(fileInfoService.getList(gid, "attach"));

        // 비회원 게시글 여부
        item.setGuest(item.getMember() == null);

        /**
         * 내 게시글 여부, 수정 가능 여부
         * 회원 게시글 : 작성한 회원번호와 로그인한 회원 번호가 일치
         * 비회원 게시글 : 비회원 비밀번호 확인이 완료된 게시글(board_seq_게시글번호)
         */
        boolean editable = true;
        if (item.isGuest()) { // 비회원 게시글
            item.setMine(session.get("board_seq_" + item.getSeq()) != null);
        } else { // 회원 게시글
            Member boardMember = item.getMember(); // 게시글을 작성한 회원
            Member member = memberUtil.getMember(); // 로그인한 회원
            item.setMine(memberUtil.isLogin() && boardMember.getSeq().equals(member.getSeq())); // 로그인한 회원 정보와 게시글 작성 회원 정보가 일치
            if (!memberUtil.isAdmin()) {
                editable = item.isMine();
            }
        }

        item.setEditable(editable);
    }

}
