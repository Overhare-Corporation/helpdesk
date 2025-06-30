package gt.helpdesk.backend.repository;

import gt.helpdesk.backend.entity.operation.StatusEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StatusEntityRepository extends JpaRepository<StatusEntity, Integer> {
    @Query("SELECT s FROM StatusEntity s WHERE s.isActive = true")
    List<StatusEntity> getAll();
}