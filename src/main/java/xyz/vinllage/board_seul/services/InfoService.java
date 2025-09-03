package xyz.vinllage.board_seul.services;

import com.querydsl.core.BooleanBuilder;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import xyz.vinllage.board_seul.controllers.BoardSearch_seul;
import xyz.vinllage.board_seul.repositories.BaseRepository_seul;
import xyz.vinllage.global.exceptions.NotFoundException;
import xyz.vinllage.global.search.ListData;
import xyz.vinllage.global.search.Pagination;

import java.util.List;

import static org.springframework.data.domain.Sort.Order.desc;

// 물건, 일련 번호, request
@Lazy
@Service
@RequiredArgsConstructor
public abstract class InfoService<T, ID> {

    protected final HttpServletRequest request;
    protected abstract BaseRepository_seul<T, ID> getRepository();

    /**
     * 단일 조회
     */
    public T get(ID id) {
        T item = getRepository().findById(id)
                .orElseThrow(NotFoundException::new);
        // 추가 정보
        addInfo(item);
        return item;
    }

    // 리스트로 가져오기: 페이지네이션 통합
    public ListData<T> getList(
            BoardSearch_seul search) {
        int page = Math.max(search.getPage(), 1);
        int limit = search.getLimit();
        limit = limit < 1 ? 20 : limit;

        // 검색어 처리 함수를 따로
        BooleanBuilder andBuilder = search(search);

        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by(desc("createdAt")));
        Page<T> data = getRepository().findAll(andBuilder, pageable);
        List<T> items = data.getContent();

        int total = (int)data.getTotalElements();
        Pagination pagination = new Pagination(page, total, 10, limit, request);

        // 후처리
        addInfo(items);


        return new ListData<>(items, pagination);
    }

    // 검색기능 분리
    protected abstract BooleanBuilder search(BoardSearch_seul search);


    // 후처리
    public void addInfo(T item) {}

    public void addInfo(List<T> items){
        items.forEach(this::addInfo);
    }

}
