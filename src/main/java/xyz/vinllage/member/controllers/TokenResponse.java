package xyz.vinllage.member.controllers;

import lombok.Data;

@Data
public class TokenResponse {
    private String token;
    private boolean forceChangePassword = false;
}
