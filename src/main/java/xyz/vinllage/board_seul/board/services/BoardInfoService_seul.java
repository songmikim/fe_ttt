package xyz.vinllage.board_seul.board.services;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.dsl.StringExpression;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import xyz.vinllage.board_seul.board.controllers.RequestBoard_seul;
import xyz.vinllage.board_seul.board.entities.Board_seul;
import xyz.vinllage.board_seul.board.entities.QBoard_seul;
import xyz.vinllage.board_seul.board.repositories.BoardRepository_seul;
import xyz.vinllage.board_seul.controllers.BoardSearch_seul;
import xyz.vinllage.board_seul.repositories.BaseRepository_seul;
import xyz.vinllage.board_seul.services.InfoService;

@Lazy
@Service
@Transactional
public class BoardInfoService_seul extends InfoService<Board_seul, String> {

    private final BoardRepository_seul repository;
    private final ModelMapper mapper;

    public BoardInfoService_seul(HttpServletRequest request,
                                 BoardRepository_seul repository,
                                 ModelMapper mapper) {  // mapper 추가!
        super(request);
        this.repository = repository;
        this.mapper = mapper;  // 초기화!
    }

    @Override
    protected BaseRepository_seul<Board_seul, String> getRepository() {
        return repository;
    }

    @Override
    protected BooleanBuilder search(BoardSearch_seul search) {
        BooleanBuilder andBuilder = new BooleanBuilder();
        QBoard_seul board = QBoard_seul.board_seul;

        String sopt = search.getSopt();
        String skey = search.getSkey();

        //deletedAt 필터링
        andBuilder.and(board.deletedAt.isNull());

        // 키워드 검색 처리 S
        sopt = StringUtils.hasText(sopt) ? sopt.toUpperCase() : "ALL";
        if (StringUtils.hasText(skey)) {
            skey = skey.trim();

            StringExpression fields = null;
            if (sopt.equals("BID")) {
                fields = board.bid;
            } else if (sopt.equals("NAME")) {
                fields = board.name;
            } else { // 통합 검색 BID + NAME
                fields = board.bid.concat(board.name);
            }

            andBuilder.and(fields.contains(skey));
        }

        return andBuilder;
    }

    public RequestBoard_seul getForm(String bid) {
        Board_seul boardSeul = get(bid);

        return mapper.map(boardSeul, RequestBoard_seul.class);
    }

}
