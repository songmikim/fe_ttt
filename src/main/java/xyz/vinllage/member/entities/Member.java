package xyz.vinllage.member.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import xyz.vinllage.file.entities.FileInfo;
import xyz.vinllage.global.entities.BaseEntity;
import xyz.vinllage.member.constants.Authority;
import xyz.vinllage.member.constants.SocialChannel;

import java.io.Serializable;
import java.time.LocalDateTime;


/*
* 회원 정보를 저장하는 엔티티 클래스
* BaseEntity를 상속받아 생성, 수정, 삭제 시간 자동 관리
*/
@Data
@Entity
@Table(indexes = {
        @Index(name = "index_member_social", columnList = "socialToken")
})
public class Member extends BaseEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long seq; // 회원 고유 번호

    @Column(length=45)
    private String gid; // gid로 프로필 이미지 조회

    @Column(length = 75, unique = true, nullable = false)
    private String email;

    @JsonIgnore
    @Column(length = 65)
    private String password;

    @Column(length = 45, nullable = false)
    private String name;

    @Column(length = 15, nullable = false)
    private String mobile;

    @Enumerated(EnumType.STRING) // enum 값을 문자열로 DB 저장
    private Authority authority = Authority.MEMBER; // 회원 권한

    private boolean termsAgree;

    private boolean locked; // 계정 중지 상태인지

    private LocalDateTime expired; // 계정 만료 일자, null이면 만료 x

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime credentialChangedAt; // 비밀번호 변경 일시

    @Enumerated(EnumType.STRING)
    private SocialChannel socialChannel;

    @Column(length = 45)
    private String socialToken;

    // 해당 회원이 관리자 권한인지 확인
    public boolean isAdmin() {
        return authority != null && authority == Authority.ADMIN;
    }

    @Transient
    private FileInfo profileImage;

    // 삭제 여부 확인
    @Transient
    public boolean isDeleted() {
        return super.getDeletedAt() != null;
    }

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime tempPasswordExpiresAt; // 임시 비밀번호 만료 일시

    @JsonIgnore
    @Column(length = 65)
    private String tempPassword; // 임시 비밀번호
}
