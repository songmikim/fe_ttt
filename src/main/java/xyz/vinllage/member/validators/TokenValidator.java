package xyz.vinllage.member.validators;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;
import xyz.vinllage.member.controllers.RequestToken;
import xyz.vinllage.member.entities.Member;
import xyz.vinllage.member.repositories.MemberRepository;

import java.time.LocalDateTime;


@Component
@RequiredArgsConstructor
public class TokenValidator implements Validator {

    private final MemberRepository repository;
    private final PasswordEncoder encoder;

    @Override
    public boolean supports(Class<?> clazz) {

        return clazz.isAssignableFrom(RequestToken.class);
    }

    @Override
    public void validate(Object target, Errors errors) {
        if (!(target instanceof RequestToken)) return;
        RequestToken form = (RequestToken) target;

        Member member = repository.findByEmail(form.getEmail()).orElse(null);
        Member socialMember = new Member();
        if (member == null)
            socialMember = repository.findBySocialToken(form.getSocialToken()).orElse(null);

        // 탈퇴한 회원일 경우
        if ((member != null && member.getDeletedAt() != null) || (socialMember != null && socialMember.getDeletedAt() != null)) {
            errors.reject("Invalid.member");

            return;
        }

        if (form.isSocial()){ // 소셜 로그인 요청인 경우
            if (form.getSocialChannel() == null){
                errors.rejectValue("socialChannel", "NotNull");
            }
            ValidationUtils.rejectIfEmptyOrWhitespace(errors, "socialChannel", "NotBlank");

        } else { // 일반 로그인 요청인 경우
            ValidationUtils.rejectIfEmptyOrWhitespace(errors, "email", "NotBlank");
            ValidationUtils.rejectIfEmptyOrWhitespace(errors, "password", "NotBlank");
            if (errors.hasErrors()) return;
            if (member == null) {
                errors.reject("NotFound.member.or.password");
            }

            if (member != null) {
                // 임시 비밀번호 X
                if (member.getTempPassword() == null) {
                    // 비밀번호가 일치하지 않은 경우
                    if (!encoder.matches(form.getPassword(), member.getPassword())) {
                        errors.reject("NotFound.member.or.password");
                    }
                }
                // 임시 비밀번호 O
                else {
                    // 기간이 만료된 경우
                    if (LocalDateTime.now().isAfter(member.getTempPasswordExpiresAt())) {
                        errors.reject("Invalid.tempPassword");

                        // 만료된 경우 만료된 임시비밀번호 삭제
                        socialMember.setTempPassword(null);
                        repository.saveAndFlush(socialMember);
                    }
                    // 비밀번호와 임시 비밀번호가 모두 일치하지 않은 경우
                    else if (!encoder.matches(form.getPassword(), member.getTempPassword())
                            && !encoder.matches(form.getPassword(), member.getPassword())) {
                        errors.reject("NotFound.member.or.password");
                    }
                }
            }
        }
    }
}
