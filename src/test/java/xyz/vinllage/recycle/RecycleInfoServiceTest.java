//package xyz.vinllage.recycle;

//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.junit.jupiter.MockitoExtension;

/**
 * RecycleInfoService.getList() 단위 테스트
 * - page/limit 보정(0,음수 → 1, 20)
 * - 정렬: rid DESC 적용 확인
 * - 반환: ListData(items+pagination) 확인
 */
//@ExtendWith(MockitoExtension.class)
//class RecycleInfoServiceTest {

//package xyz.vinllage.recycle;
//
//import com.querydsl.core.types.Predicate;
//import jakarta.servlet.http.HttpServletRequest;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.junit.jupiter.MockitoExtension;
//import org.springframework.data.domain.PageImpl;
//import org.springframework.data.domain.Pageable;
//import xyz.vinllage.global.search.ListData;
//
//import java.util.List;
//
//import static org.junit.jupiter.api.Assertions.assertEquals;
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.Mockito.when;
//
///**
// * RecycleInfoService.getList() 단위 테스트
// * - page/limit 보정(0,음수 → 1, 20)
// * - 정렬: rid DESC 적용 확인
// * - 반환: ListData(items+pagination) 확인
// */
//@ExtendWith(MockitoExtension.class)
//class RecycleInfoServiceTest {
//

//	@Mock
//	RecycleRepository repository;
//
//	@Mock
//	HttpServletRequest request; // Pagination 생성 시 필요
//
//	@InjectMocks
//	RecycleInfoService service;
//
//	@Test
//	void test1() {
//		when(repository.findAll(any(Predicate.class), any(Pageable.class)))
//				.thenAnswer(invocation -> {
//					Pageable pageable = invocation.getArgument(1);
//					RecycleResult dummy1 = new RecycleResult();
//					RecycleResult dummy2 = new RecycleResult();
//					return new PageImpl<>(List.of(dummy1, dummy2), pageable, 2);
//				});
//
//		ListData<RecycleResult> result = service.getList(0, 0);
//
//		// --- 콘솔 출력 ---
//		System.out.println("총 개수: " + result.getPagination().getTotal());
//		result.getItems().forEach(item -> System.out.println("아이템: " + item));
//
//		assertEquals(2, result.getItems().size());
//	}
//}
