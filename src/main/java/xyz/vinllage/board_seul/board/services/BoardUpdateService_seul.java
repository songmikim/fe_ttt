package xyz.vinllage.board_seul.board.services;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import xyz.vinllage.board_seul.board.controllers.RequestBoard_seul;
import xyz.vinllage.board_seul.board.entities.Board_seul;
import xyz.vinllage.board_seul.board.repositories.BoardRepository_seul;
import xyz.vinllage.board_seul.repositories.BaseRepository_seul;
import xyz.vinllage.board_seul.services.UpdateService;

@Lazy
@Service
@RequiredArgsConstructor
public class BoardUpdateService_seul extends UpdateService<Board_seul, String, RequestBoard_seul> {

    private final BoardRepository_seul repository;
    private final ModelMapper mapper;


    @Override
    protected BaseRepository_seul<Board_seul, String> getRepository() {
        return repository;
    }

    @Override
    public Board_seul beforeProcess(RequestBoard_seul form) {

        Board_seul item = mapper.map(form, Board_seul.class);
        // Board 저장 전 처리 로직
        // 예: 유효성 검사, 데이터 변환 등
        return item;
    }

    @Override
    public void afterProcess(Board_seul item) {
        // Board 저장 후 처리 로직
        // 예: 캐시 갱신, 알림 발송 등
    }

}
