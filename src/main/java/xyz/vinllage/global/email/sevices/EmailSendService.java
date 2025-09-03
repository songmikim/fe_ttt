package xyz.vinllage.global.email.sevices;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

@Service
@RequiredArgsConstructor
public class EmailSendService {
    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    /**
     * 메일 전송
     *
     * @param to 전송 대상 이메일
     * @param subject 메일 제목
     * @param title 템플릿 내 제목
     * @param code 전송할 인증 코드
     */
    public void sendEmail(String to, String subject, String title, String code) {
        // 1) 템플릿에 전달할 데이터
        Context context = new Context();
        context.setVariable("title", title);
        context.setVariable("code", code);

        // 2) 템플릿 처리
        String htmlContent = templateEngine.process("email/email", context);

        try {
            // 3) 메일 작성
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true); // true = HTML

            // 4) 메일 발송
            mailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    public void sendTemporaryPasswordEmail(String to, String code) {
        sendEmail(to, "임시 비밀번호 발급", "Vinllage 임시 비밀번호", code);
    }
}
