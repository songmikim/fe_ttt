package xyz.vinllage.member.controllers;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RequestProfile {
    private String password;
    private String confirmPassword;

    @NotBlank
    private String name;

    @NotBlank
    private String mobile;

    private String gid; // 프로필 사진 gid
}
