package xyz.vinllage.board_seul.entities;

import jakarta.persistence.*;
import lombok.Data;
import xyz.vinllage.global.entities.BaseEntity;
import xyz.vinllage.member.entities.Member;

@MappedSuperclass
@Data
public class BoardEntity_seul extends BaseEntity {
    // 작성자 관련 공통 필드
    @ManyToOne(fetch = FetchType.EAGER)
    protected Member member;

    @Column(length = 60, nullable = false)
    protected String poster; // Comment의 commenter와 BoardData의 poster 통합

    @Lob
    @Column(nullable = false)
    protected String content;

    // 비회원 관련 공통 필드
    @Column(length = 65)
    protected String guestPw;

    @Column(length = 20)
    protected String ip;

    @Column(length = 255)
    protected String ua;

    // 권한 관련 공통 @Transient 필드
    @Transient
    protected boolean canDelete;

    @Transient
    protected boolean canEdit;

    @Transient
    protected boolean canView;

    @Transient
    protected boolean guest;

    @Transient
    protected boolean mine;
}
