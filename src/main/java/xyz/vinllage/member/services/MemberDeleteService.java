package xyz.vinllage.member.services;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import xyz.vinllage.member.entities.Member;
import xyz.vinllage.member.repositories.MemberRepository;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class MemberDeleteService {

    private final MemberRepository repository;

    /**
     * 매 자정마다, 탈퇴 처리된 지 30일이 지난 회원을 db에서 지우기
     */
    @Scheduled(cron="0 0 0 * * *")
    public void deleteExpiredMembers() {
        repository.deleteAllByDeletedAtBefore(LocalDateTime.now().minusDays(30L));
    }

    public void withdrawProcess(Member member) {
        // 탈퇴 처리된 회원이면 계정 복구
        member.setDeletedAt(LocalDateTime.now());
        repository.saveAndFlush(member);
    }

    public boolean recoverProcess(Member member) {
        // 탈퇴 처리된 회원이면 계정 복구
        if (member.getDeletedAt() != null) {
            member.setDeletedAt(null);
            repository.saveAndFlush(member);
            return true;
        }
        return false;
    }
}
