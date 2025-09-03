package xyz.vinllage.crawler.controllers;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import xyz.vinllage.crawler.entities.CrawledData;
import xyz.vinllage.crawler.repositories.CrawledDataRepository;
import xyz.vinllage.global.search.ListData;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles({"default","test"})
public class EventControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper om;

    @Autowired
    private CrawledDataRepository repository;


    /**
     *  각 테스트 실행 전 초기화 작업 수행
     *  - 기존 저장소 데이터를 모두 삭제
     *  - 테스트용 이벤트 데이터 2건 삽입
     */
    @BeforeEach
    void init() {
        repository.deleteAll();

        LocalDate today = LocalDate.now();

        CrawledData data1 = new CrawledData();
        data1.setHash(1);
        data1.setLink("https://example.com/1");
        data1.setTitle("Event1");
        data1.setContent("Content1");
        data1.setDate(today.minusDays(1));
        repository.save(data1);

        CrawledData data2 = new CrawledData();
        data2.setHash(2);
        data2.setLink("https://example.com/2");
        data2.setTitle("Event2");
        data2.setContent("Content2");
        data2.setDate(today);
        repository.save(data2);
    }

    /**
     *  목록 조회 테스트
     *  - GET /api/v1/events 요청 시 2건이 반환되는지 검증
     *  - 최신 데이터가 첫 번째로 반환되는지 확인 (hash=2)
     * @throws Exception
     */
    @Test
    @DisplayName("List crawled events")
    void listTest() throws Exception {
        String body = mockMvc.perform(get("/api/v1/events"))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        ListData<CrawledData> data = om.readValue(body, new TypeReference<ListData<CrawledData>>() {});
        assertEquals(2, data.getItems().size());
        assertEquals("Event2", data.getItems().get(0).getTitle());
        assertEquals("Event1", data.getItems().get(1).getTitle());
    }

    /**
     * 검색 기능 테스트
     * - GET /api/v1/events?skey=Event1 요청 시
     * - 반환 결과가 1건인지 확인
     * @throws Exception
     */
    @Test
    @DisplayName("Search events by keyword")
    void searchTest() throws Exception {
        String body = mockMvc.perform(get("/api/v1/events").param("skey", "Event1"))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        JsonNode root = om.readTree(body);
        List<CrawledData> items = om.convertValue(root.get("items"), new TypeReference<>() {});
        assertEquals(1, items.size());
        assertEquals("Event1", items.get(0).getTitle());
    }

    /**
     * 상세 조회 테스트
     * - GET /api/v1/events/{hash} 요청 시
     * - hash=1 인 데이터의 제목이 "Event1"인지 검증
     * @throws Exception
     */
    @Test
    @DisplayName("Get event details")
    void infoTest() throws Exception {
        String body = mockMvc.perform(get("/api/v1/events/{hash}", 1))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        CrawledData item = om.readValue(body, CrawledData.class);
        assertEquals("Event1", item.getTitle());
    }

    /**
     * 404 예외 처리 테스트
     * - 존재하지 않는 이벤트 hash 값으로 상세 조회 요청시
     * - HTTP 상태 코드 404반환
     * @throws Exception
     */
    @Test
    @DisplayName("Event not found returns 404")
    void notFoundTest() throws Exception {
        mockMvc.perform(get("/api/v1/events/{hash}", 999))
                .andExpect(status().isNotFound());
    }

}
