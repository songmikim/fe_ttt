package xyz.vinllage.board_seul.comment.entities;

import jakarta.persistence.*;
import lombok.Data;
import xyz.vinllage.board_seul.entities.BoardEntity_seul;

@Data
@Entity
@Table(name = "comments", indexes = {
        @Index(name = "idx_comment_board", columnList = "boardDataSeq,deletedAt,createdAt")
})
public class Comment_seul extends BoardEntity_seul {
    @Id
    @GeneratedValue
    private Long seq;

    @Column(nullable = false)
    private Long boardDataSeq; // Comment만의 고유 필드

    @Transient
    private boolean needAuth;

    // 편의 메서드
    public String getCommenter() {
        return getPoster();
    }

    public void setCommenter(String commenter) {
        setPoster(commenter);
    }

}