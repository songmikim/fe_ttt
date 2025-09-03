package xyz.vinllage.crawler.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;
import xyz.vinllage.crawler.entities.CrawledData;
import xyz.vinllage.crawler.entities.CrawlerConfig;
import xyz.vinllage.crawler.services.CrawlerConfigService;
import xyz.vinllage.crawler.services.CrawlerSettingService;
import xyz.vinllage.crawler.services.CrawlingService;

import java.util.List;
import java.util.Map;

@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/crawler")
@PreAuthorize("hasAuthority('ADMIN')")
@Tag(name="크롤러 API", description = "크롤러 설정 API, 크롤러 API, 환경행사 API")
public class CrawlerAdminController {
    private final CrawlerConfigService configService;
    private final CrawlerSettingService settingService;
    private final CrawlingService crawlingService;
    private final RequestCrawlingValidator requestCrawlingValidator;

    @InitBinder("form")
    public void initBinder(WebDataBinder binder) {
        binder.addValidators(requestCrawlingValidator);
    }

    @Operation(summary = "크롤러 사이트 설정 목록")
    @GetMapping("/configs")
    public List<CrawlerConfig> configs() {
        return configService.gets();
    }

    @Operation(summary = "크롤러 사이트 설정 저장")
    @PostMapping("/configs")
    public void save(@Validated @RequestBody List<RequestCrawling> forms) {
        configService.save(forms);
    }

    @Operation(summary = "크롤러 사이트 설정 삭제")
    @DeleteMapping("/configs")
    public void delete(@RequestParam("id") Long id) {

        configService.delete(id);
    }

    @Operation(summary = "크롤링 테스트")
    @PostMapping("/test")
    public List<CrawledData> test(@RequestBody @Valid RequestCrawling form) {
        return crawlingService.process(form);
    }

    @Operation(summary = "스케줄러 상태 조회")
    @GetMapping("/scheduler")
    public Map<String, Boolean> scheduler() {
        return Map.of("enabled", settingService.isSchedulerEnabled());
    }

    @Operation(summary = "스케줄러 상태 변경")
    @PostMapping("/scheduler")
    public Map<String, Boolean> scheduler(@RequestParam("enabled") boolean enabled) {
        settingService.setScheduler(enabled);
        return Map.of("enabled", enabled);
    }
}
