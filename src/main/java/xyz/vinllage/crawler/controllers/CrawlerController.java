package xyz.vinllage.crawler.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import xyz.vinllage.crawler.entities.CrawledData;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/crawler")
@Tag(name="크롤러 API", description = "크롤러 설정 API, 크롤러 API, 환경행사 API")
public class CrawlerController {

    private final HttpServletRequest request;

    @PreAuthorize("hasAuthority('ADMIN')")
    @RequestMapping(method = {RequestMethod.PATCH, RequestMethod.POST})
    @Operation(
            summary = "크롤링 데이터 등록/수정",
            description = "POST 요청 시 새 크롤링 데이터를 등록, PATCH 요청 시 기존 데이터를 수정"
    )
    public CrawledData update() {
        String mode = request.getMethod().equalsIgnoreCase("PATCH") ? "update" : "register";

        return null;
    }

}
