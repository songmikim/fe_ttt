package xyz.vinllage.board_seul.board.validator;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;
import xyz.vinllage.board_seul.board.controllers.RequestBoard_seul;
import xyz.vinllage.board_seul.board.repositories.BoardRepository_seul;

@Lazy
@Component
@RequiredArgsConstructor
public class BoardValidator_seul implements Validator {
    private final BoardRepository_seul repository;

    @Override
    public boolean supports(Class<?> clazz) {
        return clazz.isAssignableFrom(RequestBoard_seul.class);
    }

    @Override
    public void validate(Object target, Errors errors) {
        if (errors.hasErrors()) {
            return;
        }

        RequestBoard_seul form = (RequestBoard_seul) target;
        String mode = form.getMode();
        String bid = form.getBid();

        // 게시판 등록시 게시판 아이디(bid)가 이미 등록된 경우 등록 불가
        if (mode.equals("register") && repository.existsByBid(bid) || bid==null ) {
            errors.rejectValue("bid", "Duplicated");
        }
    }
}
