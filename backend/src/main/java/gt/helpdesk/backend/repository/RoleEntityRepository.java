package gt.helpdesk.backend.repository;

import gt.helpdesk.backend.entity.user.RoleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleEntityRepository extends JpaRepository<RoleEntity, Integer> {
    Optional<Object> findAllByName(String name);
}