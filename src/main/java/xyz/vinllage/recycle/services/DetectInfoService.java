package xyz.vinllage.recycle.services;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import xyz.vinllage.global.search.ListData;
import xyz.vinllage.global.search.Pagination;
import xyz.vinllage.recycle.entities.DetectedRecycle;
import xyz.vinllage.recycle.entities.QDetectedRecycle;
import xyz.vinllage.recycle.repositories.DetectedRecycleRepository;

import static org.springframework.data.domain.Sort.Order.asc;

@Lazy
@Service
@RequiredArgsConstructor
public class DetectInfoService {

    private final DetectedRecycleRepository repository;
    private final HttpServletRequest request;

    public DetectedRecycle get() {

        return null;
    }

    public ListData<DetectedRecycle> getList(String gid, int page, int limit) {
        page = Math.max(page, 1);
        limit = limit < 1 ? 20 : limit;

		Pageable pageable = PageRequest.of(page - 1, limit, Sort.by(asc("gid")));

		QDetectedRecycle detectedRecycle = QDetectedRecycle.detectedRecycle;
		BooleanBuilder where = new BooleanBuilder().and(detectedRecycle.deletedAt.isNull())
				.and(detectedRecycle.gid.eq(gid));

		Page<DetectedRecycle> data = repository.findAll(where, pageable);

		Pagination pagination = new Pagination(page, (int) data.getTotalElements(), 10, limit, request);
		return new ListData<>(data.getContent(), pagination);
	}
}
