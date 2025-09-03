package xyz.vinllage.recycle.controllers;

import com.querydsl.jpa.impl.JPAQueryFactory;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import xyz.vinllage.global.exceptions.BadRequestException;
import xyz.vinllage.global.libs.Utils;
import xyz.vinllage.global.search.ListData;
import xyz.vinllage.global.search.Pagination;
import xyz.vinllage.member.entities.Member;
import xyz.vinllage.member.libs.MemberUtil;
import xyz.vinllage.recycle.entities.DetectedRecycle;
import xyz.vinllage.recycle.entities.QDetectedRecycle;
import xyz.vinllage.recycle.services.DetectInfoService;
import xyz.vinllage.recycle.services.DetectSaveService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/recycle")
@Tag(name="분리수거 API", description = "분리수거 데이터 저장/조회/수정/삭제 기능 제공")
public class RecycleController {
    private final JPAQueryFactory queryFactory;
    private final DetectSaveService detectSaveService;
    private final DetectInfoService detectInfoService;
    private final MemberUtil memberUtil;
    private final Utils utils;


    @Operation(summary = "감지된 재활용 크롭 이미지 저장", method = "POST")
    @ApiResponse(responseCode = "201", description = "성공 시 201로 응답, 검증 실패시 400")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED) // 201로 응답
    public DetectedRecycle upload(
            @RequestPart("file") List<MultipartFile> files,
            @RequestPart("items") String itemsJson,
            Errors errors
    ) {
        if (errors.hasErrors()) {
            throw new BadRequestException(utils.getErrorMessages(errors));
        }

        Member loggedMember = memberUtil.getMember();
        DetectedRecycle detectedRecycle = detectSaveService.process(files, itemsJson, loggedMember);

        return detectedRecycle;
    }
  
    @Operation(summary = "분리수거 데이터 목록 조회", description = "page 기본값 1, limit 기본값 20")
    @GetMapping("/result")
    public ListData<DetectedRecycle> list(
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "20") int limit,
        @RequestParam String gid
    ) {
        return detectInfoService.getList(gid, page, limit);
    }

    @Operation(summary = "현재 로그인한 회원의 모든 분리수거 데이터 목록 조회", method = "GET")
    @ApiResponse(responseCode = "200")
    @GetMapping("/my-data")
    public ListData<DetectedRecycle> myRecycleData(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            HttpServletRequest request
    ) {
        System.out.println("page:"+page+",limit:"+limit);
        System.out.println("member:"+memberUtil.getMember());
        // 현재 로그인한 회원 정보
        Member loggedMember = memberUtil.getMember();

        QDetectedRecycle recycleData = QDetectedRecycle.detectedRecycle;

        // 전체 레코드 수
        long total = queryFactory.selectFrom(recycleData)
                .where(recycleData.member.eq(loggedMember))
                .fetchCount();

        if (total == 0) return new ListData<>();

        // 페이지네이션 데이터
        Pagination pagination = new Pagination(page, (int) total, 10, limit, request);

        // 실제 보여줄 데이터
        List<DetectedRecycle> items = queryFactory.selectFrom(recycleData)
                .where(recycleData.member.eq(loggedMember))
                .offset((long) (pagination.getPage() - 1) * pagination.getLimit())
                .limit(pagination.getLimit())
                .fetch();

        return new ListData<>(items, pagination);
    }

    @Operation(summary = "전체 분리수거 누적 횟수 조회", method = "GET")
    @ApiResponse(responseCode = "200")
    @GetMapping("/total-count")
    public long getTotalRecycleCount() {
        QDetectedRecycle recycleData = QDetectedRecycle.detectedRecycle;

        // 조건 없이 전체 데이터 카운트
        return queryFactory.selectFrom(recycleData).fetchCount();
    }
}
