package gt.helpdesk.backend.repository;

import gt.helpdesk.backend.dto.TicketDto;
import gt.helpdesk.backend.entity.operation.TicketEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TicketEntityRepository extends JpaRepository<TicketEntity, Integer> {

    @Transactional
    @Modifying
    @Query("UPDATE TicketEntity t SET t.isActive = false WHERE t.uuid = ?1")
    void logicDelete(UUID uuid);

    @Query("SELECT t FROM TicketEntity t WHERE t.uuid = ?1")
    Optional<TicketEntity> findByUuid(UUID uuid);

    @Query("SELECT t FROM TicketEntity t WHERE t.uuid = ?1 AND t.isActive = true")
    TicketEntity entityExist(UUID uuid);

    @Query("SELECT new gt.helpdesk.backend.dto.TicketDto(t) FROM TicketEntity t WHERE t.isActive = true")
    Page<TicketDto> findAllByIsActive(Pageable pageable);
}