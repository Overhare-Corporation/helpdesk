package gt.helpdesk.backend.repository;

import gt.helpdesk.backend.entity.operation.TicketEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TicketEntityRepository extends JpaRepository<TicketEntity, Integer> {
}