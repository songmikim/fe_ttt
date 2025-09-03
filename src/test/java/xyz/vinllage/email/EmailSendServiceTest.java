package xyz.vinllage.email;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import xyz.vinllage.global.email.sevices.EmailSendService;

@SpringBootTest
public class EmailSendServiceTest {

    @Autowired
    private EmailSendService service;

    @Test
    void sendTest(){
        String to = "annsomde@naver.com";
        String code = "123456";

        //service.sendVerificationEmail(to, code);
    }
}
