package gt.helpdesk.backend.service;

import gt.helpdesk.backend.dto.TicketDto;
import gt.helpdesk.backend.entity.operation.StatusEntity;
import gt.helpdesk.backend.records.TicketRecord;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public interface TicketService {
    Page<TicketDto> getAllTickets(int page, int size);

    TicketDto createTicket(TicketRecord ticketRecord);

    List<StatusEntity> getAllStatuses();

    TicketDto updateTicket(TicketRecord ticketRecord, UUID uuid);

    void deleteTicket(UUID uuid);
}
