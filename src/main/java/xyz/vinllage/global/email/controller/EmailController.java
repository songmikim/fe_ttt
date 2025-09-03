package xyz.vinllage.global.email.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;
import xyz.vinllage.global.email.dtos.RequestEmail;
import xyz.vinllage.global.email.sevices.EmailSendService;
import xyz.vinllage.global.email.sevices.EmailVerifyService;
import xyz.vinllage.global.libs.Utils;
import xyz.vinllage.global.validators.EmailAuthValidator;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class EmailController {
    private final Utils utils;
    private final EmailAuthValidator emailAuthValidator;
    private final EmailSendService sendService;
    private final EmailVerifyService verifyService;

    @PostMapping("/send-code")
    public ResponseEntity<?> sendCode(@Valid @RequestBody RequestEmail request, Errors errors) {
        // 이메일 중복 검증
        emailAuthValidator.validate(request, errors);

        if (errors.hasErrors()) {
            System.out.println("에러있음!");
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("messages", utils.getErrorMessages(errors)));
        }

        String code = "";
        String subject = "";
        String title = "";
        switch (request.getType()) {
            case SIGN_UP_VERIFICATION -> {
                code = verifyService.generateCode(request.getEmail());
                subject = "회원가입 인증 메일";
                title = "Vinllage 회원가입 인증 코드";
            }
            // 탈퇴 인증 메일
            case WITHDRAWAL_VERIFICATION -> {
                code = verifyService.generateCode(request.getEmail());
                subject = "탈퇴 인증 메일";
                title = "Vinllage 탈퇴 인증 코드";
            }
            // 계정 복구 메일
            case ACCOUNT_RECOVERY -> {
                code = verifyService.generateCode(request.getEmail());
                subject = "계정 복구 메일";
                title = "Vinllage 계정 복구 인증 코드";
            }
        }

        sendService.sendEmail(request.getEmail(), subject, title, code);
        return ResponseEntity.ok("인증 코드 전송 완료");
    }

    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyCode(@RequestParam String email, @RequestParam String code) {
        if (verifyService.verifyCode(email, code)) {
            return ResponseEntity.ok("인증 성공");
        }
        return ResponseEntity.badRequest().body("인증 실패");
    }
}
