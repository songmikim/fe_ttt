package xyz.vinllage.member.services;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import xyz.vinllage.global.email.sevices.EmailSendService;
import xyz.vinllage.member.controllers.RequestToken;
import xyz.vinllage.member.entities.Member;
import xyz.vinllage.member.repositories.MemberRepository;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Lazy
@Service
@RequiredArgsConstructor
public class PasswordService {
    private final RedisTemplate<String , String> redisTemplate;
    private final MemberRepository repository;
    private final EmailSendService service;
    private final PasswordEncoder encoder;

    private static final String CHAR_SET="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    /**
     * 보안 강화를 위한 랜덤 비밀번호 생성
     * @param length
     * @return
     */
    private String generateRandomPassword(int length) {
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < length; i++) {
            sb.append(CHAR_SET.charAt(random.nextInt(CHAR_SET.length())));
        }

        return sb.toString();
    }

    public void process(Member member){
        // 1. 임시 비밀번호 생성 밎 저장
        String tempPw = generateRandomPassword(12);
        member.setTempPassword(encoder.encode(tempPw));

        // 2. 임시 비밀번호 만료기한 설정 (5분)
        member.setTempPasswordExpiresAt(LocalDateTime.now().plusMinutes(5L));

        // 3. db에 저장
        repository.saveAndFlush(member);

        // 4. 임시 비밀번호를 메일로 전송
        service.sendTemporaryPasswordEmail(member.getEmail(), tempPw);
    }

    public boolean matchesPassword(String formPw, Member member){
        return encoder.matches(formPw , member.getPassword());
    }
    public boolean matchesTempPassword(String form, Member member){
        return encoder.matches(form, member.getTempPassword());
    }

    /**
     * 정상 로그인 -> 임시 비밀번호 제거
     */
    public void deleteTempPassword(RequestToken form, Member member) {
        if (member.getTempPassword() != null && matchesPassword(form.getPassword(), member)) {
            member.setTempPassword(null);
            member.setTempPasswordExpiresAt(null);
            repository.saveAndFlush(member);
        }
    }

}
