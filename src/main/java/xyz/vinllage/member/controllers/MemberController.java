package xyz.vinllage.member.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;
import xyz.vinllage.global.email.dtos.RequestEmail;
import xyz.vinllage.global.exceptions.BadRequestException;
import xyz.vinllage.global.libs.Utils;
import xyz.vinllage.member.entities.Member;
import xyz.vinllage.member.jwt.TokenService;
import xyz.vinllage.member.libs.MemberUtil;
import xyz.vinllage.member.repositories.MemberRepository;
import xyz.vinllage.member.services.JoinService;
import xyz.vinllage.member.services.MemberDeleteService;
import xyz.vinllage.member.services.PasswordService;
import xyz.vinllage.member.services.ProfileUpdateService;
import xyz.vinllage.member.validators.JoinValidator;
import xyz.vinllage.member.validators.ProfileValidator;
import xyz.vinllage.member.validators.TokenValidator;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/member")
@Tag(name="회원 API", description = "회원 가입, 회원 인증 토큰 발급 기능 제공")
public class MemberController {
    private final JoinValidator joinValidator;
    private final JoinService joinService;
    private final TokenValidator tokenValidator;
    private final TokenService tokenService;
    private final ProfileValidator profileValidator;
    private final ProfileUpdateService profileUpdateService;
    private final HttpServletRequest request;
    private final MemberUtil memberUtil;
    private final Utils utils;
    private final MemberRepository repository;
    private final PasswordService passwordService;
    private final MemberDeleteService deleteService;

    @Operation(summary = "회원가입처리", method = "POST")
    @ApiResponse(responseCode = "201", description = "회원가입 성공시 201로 응답, 검증 실패시 400")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED) // 201로 응답
    public void join(@Valid @RequestBody RequestJoin form, Errors errors) {

        joinValidator.validate(form, errors);

        if (errors.hasErrors()) {
            throw new BadRequestException(utils.getErrorMessages(errors));
        }

        joinService.process(form);
    }

    /**
     * 회원 계정(이메일, 비밀번호)으로 JWT 토큰 발급
     *
     * @return
     */
    @Operation(summary = "회원 인증 처리", description = "이메일과 비밀번호로 인증한 후 회원 전용 요청을 보낼수 있는 토큰(JWT)을 발급")
    @Parameters({
            @Parameter(name="email", required = true, description = "이메일 ,일반 로그인 시 필수"),
            @Parameter(name="password", required = true, description = "비밀번호, 일반 로그인 시 필수"),
            @Parameter(name="socialChannel", required = true, description = "쇼설 로그인 구분 , 소셜 로그인 시 필수 "),
            @Parameter(name="socialToken", required = true, description = "쇼설 로그인 발급 받은 회원을 구분 값  , 소셜 로그인 시 필수 "),
    })
    @ApiResponse(responseCode = "200", description = "인증 성공시 토큰(JWT)발급")
    @PostMapping({"/token", "/social/token"})
    public TokenResponse token(@Valid @RequestBody RequestToken form, Errors errors) {
        form.setSocial(request.getRequestURI().contains("/social"));

        tokenValidator.validate(form, errors);

        if (errors.hasErrors()) {
            System.out.println("----- 검증 에러 ------");
            errors.getAllErrors().forEach(System.out::println);
            throw new BadRequestException(utils.getErrorMessages(errors));
        }

        // 일반, 소셜 구분해서 토큰 발급
        TokenResponse tokenResponse = new TokenResponse();
        tokenResponse.setToken(form.isSocial() ? tokenService.create(form.getSocialChannel(), form.getSocialToken()) : tokenService.create(form.getEmail()));

        Member member = repository.findByEmail(form.getEmail()).orElse(null);

        // 정상적으로 로그인 시도 -> 기존에 있던 임시 비밀번호 제거(일반 회원일 때만 검사)
        if (!form.isSocial()) {
            passwordService.deleteTempPassword(form, member);

            // 임시 비밀번호 여부
            if (member.getTempPassword() != null) {
                tokenResponse.setForceChangePassword(passwordService.matchesTempPassword(form.getPassword(), member));
            }
        }

        return tokenResponse;
    }

    /**
     * 로그인한 회원 정보 출력
     *
     * @return
     */
    @Operation(summary = "로그인 상태인 회원 정보를 조회", method = "GET")
    @ApiResponse(responseCode = "200")
    @GetMapping // GET /api/v1/member
    public ResponseEntity<Member> myInfo() {
        return memberUtil.isLogin() ? ResponseEntity.ok(memberUtil.getMember()) : ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @Operation(summary = "로그인한 회원의 회원 정보를 수정 처리", method = "PATCH")
    @PatchMapping("/update")
    @PreAuthorize("isAuthenticated()")
    public Member update(@Valid @RequestBody RequestProfile form, Errors errors) {

        profileValidator.validate(form, errors);

        if (errors.hasErrors()) {
            throw new BadRequestException(utils.getErrorMessages(errors));
        }

        return profileUpdateService.process(form);
    }

    @Operation(summary = "임시 비밀번호를 메일로 발송", method = "POST")
    @ApiResponse(responseCode = "200")
    @PostMapping("/find-pw")
    public ResponseEntity<?> findPassword(@RequestBody RequestEmail form){
        String email  = form.getEmail();

        // 멤버 조회
        Member member = repository.findByEmail(email).orElse(null);

        // 멤버가 존재하지 않으면 프론트엔드에 검증 메시지 전달
        if (member == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("member","등록되지 않은 이메일입니다."));
        }

        // db 처리 및 메일 전송
        passwordService.process(member);

        // 프론트엔드에 메일 발송 성공 메시지 전달
        return ResponseEntity.ok(Map.of("message", "임시 비밀번호가 발송되었습니다"));
    }

    @Operation(summary = "회원 탈퇴 처리", method = "POST")
    @ApiResponse(responseCode = "200")
    @PostMapping("/withdraw")
    public ResponseEntity<?> withdraw(){
        Member member = memberUtil.getMember();

        // 계정 탈퇴 처리(탈퇴 시각 기록)
        deleteService.withdrawProcess(member);

        return ResponseEntity.ok(Map.of("message", "탈퇴 처리가 완료되었습니다."));
    }

    @Operation(summary = "계정 복구", method = "POST")
    @ApiResponse(responseCode = "200")
    @PostMapping("/recover-acc")
    public ResponseEntity<?> recoverAcc(@RequestBody RequestEmail form){
        String email  = form.getEmail();

        // 멤버 조회
        Member member = repository.findByEmail(email).orElse(null);

        // 멤버가 존재하지 않으면 프론트엔드에 검증 메시지 전달
        if (member == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message","등록되지 않은 이메일입니다."));
        }

        // 계정 복구 처리
        boolean isRecovered = deleteService.recoverProcess(member);
        if (!isRecovered) {
            // 탈퇴 처리 되지 않은 계정인 경우
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message","탈퇴되지 않은 계정입니다."));
        }

        // 프론트엔드에 메일 발송 성공 메시지 전달
        return ResponseEntity.ok(Map.of("message", "계정이 복구되었습니다."));
    }
}
