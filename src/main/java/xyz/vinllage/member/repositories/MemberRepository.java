package xyz.vinllage.member.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import xyz.vinllage.member.constants.SocialChannel;
import xyz.vinllage.member.entities.Member;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * JpaRepository → 기본 DB CRUD 자동 제공
 *
 * QuerydslPredicateExecutor → 복잡한 조건 검색 가능
 *
 * findByEmail → 이메일로 회원 조회
 *
 * existsByEmail → 이메일 중복 여부 확인
 */
 public interface MemberRepository extends JpaRepository<Member, Long>, QuerydslPredicateExecutor<Member> {
    Optional<Member> findByEmail(String email);
    Optional<Member> findBySocialToken(String socialToken);
    boolean existsByEmail(String email);

    Optional<Member> findBySocialChannelAndSocialToken(SocialChannel socialChannel, String socialToken);
    void deleteAllByDeletedAtBefore(LocalDateTime threshold);
}
