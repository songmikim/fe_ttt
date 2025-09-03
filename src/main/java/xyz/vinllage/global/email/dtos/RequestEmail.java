package xyz.vinllage.global.email.dtos;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RequestEmail {
    @NotBlank
    @Email
    String email;

    @NotNull
    @Enumerated(EnumType.STRING)
    EmailType type;
}
