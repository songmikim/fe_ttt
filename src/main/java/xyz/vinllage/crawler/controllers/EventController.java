package xyz.vinllage.crawler.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import xyz.vinllage.crawler.entities.CrawledData;
import xyz.vinllage.crawler.services.CrawledDataInfoService;
import xyz.vinllage.global.search.CommonSearch;
import xyz.vinllage.global.search.ListData;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/events")
@Tag(name="크롤러 API", description = "크롤러 설정 API, 크롤러 API, 환경행사 API")
public class EventController {

    private final CrawledDataInfoService infoService;

    @Operation(summary = "환경 행사 목록 조회", description = "저장된 모든 환경 행사 정보를 페이지 단위로 조회")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "환경 행사 목록"),
            @ApiResponse(responseCode = "204", description = "조회된 데이터 없음")
    })
    @GetMapping
    public ListData<CrawledData> list(@ModelAttribute CommonSearch search) {
        return infoService.getList(search);
    }

    @Operation(summary = "환경 행사 상세 조회", description = "해시값으로 단일 환경 행사 정보를 조회")
    @Parameter(name = "hash", required = true, in = ParameterIn.PATH, description = "환경 행사 데이터를 식별하는 해시값")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "환경 행사 상세 정보"),
            @ApiResponse(responseCode = "404", description = "환경 행사 정보를 찾을 수 없음")
    })
    @GetMapping("/{hash}")
    public CrawledData info(@PathVariable("hash") Integer hash) {
        return infoService.get(hash);
    }
}

