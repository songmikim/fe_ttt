package xyz.vinllage.board_seul.post.services;

import jakarta.transaction.Transactional;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import xyz.vinllage.board_seul.post.entities.BoardData_seul;
import xyz.vinllage.board_seul.post.repositories.BoardDataRepository_seul;
import xyz.vinllage.board_seul.repositories.BaseRepository_seul;
import xyz.vinllage.board_seul.services.DeleteService;
import xyz.vinllage.board_seul.services.InfoService;

@Lazy
@Service
@Transactional
public class BoardDataDeleteService_seul extends DeleteService<BoardData_seul,Long> {
    private final BoardDataInfoService_seul infoService;
    private final BoardDataRepository_seul repository;


    public BoardDataDeleteService_seul(BoardDataInfoService_seul infoService, BoardDataRepository_seul repository) {
        this.infoService = infoService;
        this.repository = repository;
    }

    @Override
    protected InfoService<BoardData_seul, Long> getInfoService() {
        return infoService;
    }

    @Override
    protected BaseRepository_seul<BoardData_seul, Long> getRepository() {
        return repository;
    }

    @Override
    protected String getNotFoundErrorMessage() {
        return "글을 찾을 수 없습니다.";
    }

}
