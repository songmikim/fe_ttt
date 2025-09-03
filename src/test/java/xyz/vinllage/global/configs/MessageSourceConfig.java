package xyz.vinllage.global.configs;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.MessageSource;

import java.util.Locale;

@SpringBootTest
public class MessageSourceConfig {
    @Autowired
    MessageSource messageSource;

    @Test
    void testMessage() {
        String msg = messageSource.getMessage("Duplicated.email", null, Locale.KOREAN);
        System.out.println("msg = " + msg);
    }
}
