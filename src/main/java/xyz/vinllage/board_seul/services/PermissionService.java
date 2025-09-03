package xyz.vinllage.board_seul.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import xyz.vinllage.board_seul.entities.BoardEntity_seul;
import xyz.vinllage.member.constants.Authority;
import xyz.vinllage.member.entities.Member;
import xyz.vinllage.member.libs.MemberUtil;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public abstract class PermissionService<T extends BoardEntity_seul> {
    private final MemberUtil memberUtil;

    // 게시판 설정에 따른 처리
    public boolean authCheck(Authority auth) {
        return switch (auth) {
            case ALL ->
                // 모든 사용자 (회원, 비회원, 관리자) 권한 있음
                    true;
            case MEMBER ->
                // 회원(USER) 또는 관리자(ADMIN) 권한 있음
                    memberUtil.isLogin();
            case ADMIN ->
                // 관리자(ADMIN)만 권한 있음
                    memberUtil.isAdmin();
            default -> false;
        };
    }

    // 회원일때 본인 확인
    // 비회원
    public boolean memberOrGuest(T item) {
        System.out.println("관리자"+memberUtil.isAdmin());
        System.out.println("회원"+item.getMember());
        System.out.println("회원"+memberUtil.getMember());

        // 회원인 경우 본인 확인
        if (item.getMember() != null) {
            Member currentMember = memberUtil.getMember();
            if (currentMember == null) {
                return false; // NPE 방지
            }

            return Objects.equals(
                    item.getMember().getEmail(),
                    currentMember.getEmail()
            );
        } else {
            // 비회원은 비밀번호 확인이 필요한데 그건 needAuth에서 따로 체크
            return true;
        }
    }

    // 상속시켜서 처리
    protected abstract boolean canAccess(T item);

    // 수정 권한 확인: 작성자
    public boolean canEdit(T item) {
        System.out.println("canEdit"+ memberOrGuest(item));
      return memberOrGuest(item);
    }

    // 삭제 권한 확인: 관리자와 작성자
    public boolean canDelete(T item) {
        System.out.println("canEdit"+ memberOrGuest(item));
        // 관리자는 모든 글 삭제 가능
        if (memberUtil.isAdmin()) {
            return true;
        }
        return memberOrGuest(item);
    }

    // 비회원 게시글/댓글인 경우 비회원 비밀번호 확인
    public boolean needAuth(T item) {
        // 관리자는 멤버와 상관없음
        if (memberUtil.isAdmin()) {
            return false;
        }

        // 회원인지 아닌지 판가름
        if (item.getMember() != null) {
            return false;
        } else {
            return true;
        }
    }

}
