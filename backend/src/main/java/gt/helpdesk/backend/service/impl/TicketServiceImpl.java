package gt.helpdesk.backend.service.impl;

import gt.helpdesk.backend.dto.StatusDto;
import gt.helpdesk.backend.dto.TicketDto;
import gt.helpdesk.backend.entity.operation.StatusEntity;
import gt.helpdesk.backend.entity.operation.TicketEntity;
import gt.helpdesk.backend.records.TicketRecord;
import gt.helpdesk.backend.repository.StatusEntityRepository;
import gt.helpdesk.backend.repository.TicketEntityRepository;
import gt.helpdesk.backend.repository.UserEntityRepository;
import gt.helpdesk.backend.service.TicketService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class TicketServiceImpl implements TicketService {

    final private TicketEntityRepository ticketEntityRepository;
    final private StatusEntityRepository statusEntityRepository;
    final private UserEntityRepository userEntityRepository;

    @Override
    public Page<TicketDto> getAllTickets(int page, int size) {
        try {
            return ticketEntityRepository.findAll(PageRequest.of(page, size))
                    .map(ticket -> new TicketDto(
                            ticket.getOpenedBy().getName(),
                            ticket.getOwnTicket(),
                            ticket.getProviderTicket(),
                            ticket.getAssignedTo().getName(),
                            ticket.getRequiredBy(),
                            new StatusDto(ticket.getOwnStatus()),
                            new StatusDto(ticket.getProviderStatus())
                    ));
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving tickets: " + e.getMessage());
        }
    }

    @Override
    public TicketDto createTicket(TicketRecord ticketRecord) {
        try {
            final Integer ownStatusId = ticketRecord.ownStatusId();
            final Integer providerStatusId = ticketRecord.providerStatusId();
            final Integer assignedToId = ticketRecord.assignedToId();
            final Integer openedById = ticketRecord.openedById();
            var ownStatus = statusEntityRepository.findById(ownStatusId)
                    .orElseThrow(() -> new RuntimeException("Own status not found"));
            var providerStatus = statusEntityRepository.findById(providerStatusId)
                    .orElseThrow(() -> new RuntimeException("Provider status not found"));
            var assignedTo = userEntityRepository.findById(assignedToId)
                    .orElseThrow(() -> new RuntimeException("Assigned user not found"));
            var openedBy = userEntityRepository.findById(openedById)
                    .orElseThrow(() -> new RuntimeException("Opened by user not found"));
            var ticket = ticketEntityRepository.save(new TicketEntity(
                    openedBy,
                    ticketRecord.ownTicket(),
                    ticketRecord.providerTicket(),
                    assignedTo,
                    ticketRecord.requiredBy(),
                    ownStatus,
                    providerStatus
            ));
            return new TicketDto(
                    ticket.getOpenedBy().getName(),
                    ticket.getOwnTicket(),
                    ticket.getProviderTicket(),
                    ticket.getAssignedTo().getName(),
                    ticket.getRequiredBy(),
                    new StatusDto(ticket.getOwnStatus()),
                    new StatusDto(ticket.getProviderStatus())
            );
        } catch (Exception e) {
            throw new RuntimeException("Error creating ticket: " + e.getMessage());
        }
    }

    @Override
    public List<StatusEntity> getAllStatuses() {
        try {
            return statusEntityRepository.getAll();
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving statuses: " + e.getMessage());
        }
    }
}
