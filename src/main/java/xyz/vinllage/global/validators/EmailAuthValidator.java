package xyz.vinllage.global.validators;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;
import xyz.vinllage.global.email.dtos.EmailType;
import xyz.vinllage.global.email.dtos.RequestEmail;
import xyz.vinllage.member.repositories.MemberRepository;

@Component
@RequiredArgsConstructor
public class EmailAuthValidator implements Validator {
    private final MemberRepository repository;

    @Override
    public boolean supports(Class<?> clazz) {
        return RequestEmail.class.isAssignableFrom(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        RequestEmail request = (RequestEmail) target;

        if (request.getType() == EmailType.SIGN_UP_VERIFICATION && repository.existsByEmail(request.getEmail())) {
            errors.rejectValue("email", "Duplicated.email");
        }
    }
}
