package xyz.vinllage.board_seul.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean  // 이 인터페이스는 실제 Bean으로 생성되지 않음
public interface BaseRepository_seul<T, ID> extends JpaRepository<T, ID>, QuerydslPredicateExecutor<T> {
// 공통 메서드가 필요하면 여기에 추가
}
