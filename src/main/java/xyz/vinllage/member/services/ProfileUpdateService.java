package xyz.vinllage.member.services;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import xyz.vinllage.file.services.FileUploadService;
import xyz.vinllage.member.controllers.RequestProfile;
import xyz.vinllage.member.entities.Member;
import xyz.vinllage.member.libs.MemberUtil;
import xyz.vinllage.member.repositories.MemberRepository;

import java.time.LocalDateTime;

@Lazy
@Service
@RequiredArgsConstructor
public class ProfileUpdateService {
    private final MemberRepository repository;
    private final FileUploadService uploadService;
    private final PasswordEncoder encoder;
    private final MemberUtil memberUtil;

    public Member process(RequestProfile form) {
        Member member = memberUtil.getMember();

        member.setName(form.getName());
        member.setMobile(form.getMobile());

        String password = form.getPassword();
        if (StringUtils.hasText(password)) {
            member.setPassword(encoder.encode(password));
            member.setCredentialChangedAt(LocalDateTime.now());
        }

        String gid = form.getGid();
        if (StringUtils.hasText(gid)) {
            member.setGid(gid);
        }

        repository.saveAndFlush(member);

        // 파일 업로드 완료 처리
        uploadService.processDone(gid);
        return member;
    }
}
