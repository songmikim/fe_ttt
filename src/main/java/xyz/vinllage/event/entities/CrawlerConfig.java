package xyz.vinllage.event.entities;

import jakarta.persistence.*;
import lombok.Data;
import xyz.vinllage.global.entities.BaseEntity;

@Data
@Entity
public class CrawlerConfig extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100, nullable = false, unique = true)
    private String siteName;

    @Lob
    @Column(nullable = false)
    private String script;

    private boolean enabled;
}
