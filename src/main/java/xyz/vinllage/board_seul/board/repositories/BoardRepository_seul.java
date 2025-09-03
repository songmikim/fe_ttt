package xyz.vinllage.board_seul.board.repositories;

import xyz.vinllage.board_seul.board.entities.Board_seul;
import xyz.vinllage.board_seul.repositories.BaseRepository_seul;

public interface BoardRepository_seul extends BaseRepository_seul<Board_seul, String> {
    boolean existsByBid(String bid);
}
