package xyz.vinllage.board_seul.entities;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.Transient;
import lombok.Data;
import xyz.vinllage.global.entities.BaseEntity;
import xyz.vinllage.member.constants.Authority;

@MappedSuperclass
@Data
public class AuthorityEntity_seul extends BaseEntity {
    @Enumerated(EnumType.STRING)
    protected Authority listAuthority;

    @Enumerated(EnumType.STRING)
    protected Authority viewAuthority;

    @Enumerated(EnumType.STRING)
    protected Authority writeAuthority;

    @Enumerated(EnumType.STRING)
    protected Authority commentAuthority;

    @Transient
    protected boolean writable;

    @Transient
    protected boolean listable;
}
