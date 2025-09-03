package xyz.vinllage.crawler.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import xyz.vinllage.crawler.entities.CrawledData;

public interface CrawledDataRepository extends JpaRepository<CrawledData, Integer>, QuerydslPredicateExecutor<CrawledData> {

    void deleteByLinkStartingWith(String prefix);
}
