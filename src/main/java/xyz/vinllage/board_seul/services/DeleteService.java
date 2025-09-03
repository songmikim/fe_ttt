package xyz.vinllage.board_seul.services;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import xyz.vinllage.board_seul.repositories.BaseRepository_seul;
import xyz.vinllage.global.entities.BaseEntity;
import xyz.vinllage.global.exceptions.NotFoundException;

import java.time.LocalDateTime;
import java.util.List;

@Lazy
@Service
@RequiredArgsConstructor
public abstract class DeleteService<T extends BaseEntity,ID> {

    protected abstract InfoService<T, ID> getInfoService();
    protected abstract BaseRepository_seul<T, ID> getRepository();
    protected abstract String getNotFoundErrorMessage();

    public void delete(ID id) {
        try {
            T entity = getInfoService().get(id);
            entity.setDeletedAt(LocalDateTime.now());
            getRepository().saveAndFlush(entity);
        } catch(NotFoundException e) {
            throw new RuntimeException(getNotFoundErrorMessage());
        }
    }

    public void delete(List<ID> ids) {
        List<T> entities = getRepository().findAllById(ids);
        LocalDateTime now = LocalDateTime.now();

        for (T b : entities) {
            b.setDeletedAt(now);
        }

        getRepository().saveAll(entities);
    }

}
