package xyz.vinllage.board_seul.board.services;

import jakarta.transaction.Transactional;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import xyz.vinllage.board_seul.board.entities.Board_seul;
import xyz.vinllage.board_seul.board.repositories.BoardRepository_seul;
import xyz.vinllage.board_seul.repositories.BaseRepository_seul;
import xyz.vinllage.board_seul.services.DeleteService;
import xyz.vinllage.board_seul.services.InfoService;

@Lazy
@Service
@Transactional
public class BoardDeleteService_seul extends DeleteService<Board_seul, String> {

    private final BoardInfoService_seul infoservice;
    private final BoardRepository_seul repository;

    public BoardDeleteService_seul(BoardInfoService_seul infoservice, BoardRepository_seul repository) {
        this.infoservice = infoservice;
        this.repository = repository;
    }

    @Override
    protected InfoService<Board_seul, String> getInfoService() {
        return infoservice;
    }

    @Override
    protected BaseRepository_seul<Board_seul, String> getRepository() {
        return repository;
    }

    @Override
    protected String getNotFoundErrorMessage() {
        return "게시판이 없습니다.";
    }
}
