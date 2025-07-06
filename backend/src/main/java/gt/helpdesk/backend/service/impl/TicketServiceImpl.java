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
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class TicketServiceImpl implements TicketService {

    final private TicketEntityRepository ticketEntityRepository;
    final private StatusEntityRepository statusEntityRepository;
    final private UserEntityRepository userEntityRepository;

    @Override
    public Page<TicketDto> getAllTickets(int page, int size) {
        try {
            return ticketEntityRepository.findAllByIsActive(PageRequest.of(page, size));
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving tickets: " + e.getMessage());
        }
    }

    @Override
    public TicketDto createTicket(TicketRecord ticketRecord) {
        try {
            final Integer ownStatusId = statusEntityRepository.findIdByUuid(UUID.fromString(ticketRecord.ownStatusId()));
            final Integer providerStatusId = statusEntityRepository.findIdByUuid(UUID.fromString(ticketRecord.providerStatusId()));
            final Integer assignedToId = userEntityRepository.findIdByUuid(UUID.fromString(ticketRecord.assignedToId()));
            final Integer openedById = userEntityRepository.findIdByUuid(UUID.fromString(ticketRecord.openedById()));
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
                    ticket.getUuid(),
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

    @Override
    public TicketDto updateTicket(TicketRecord ticketRecord, UUID uuid) {
        try {
            final TicketEntity existingTicket = ticketEntityRepository.findByUuid(uuid)
                    .orElseThrow(() -> new RuntimeException("Ticket not found"));

            if (ticketRecord.ownStatusId() != null) {
                existingTicket.setOwnStatus(statusEntityRepository.findByUuid(UUID.fromString(ticketRecord.ownStatusId()))
                        .orElseThrow(() -> new RuntimeException("Own status not found")));
            }
            if (ticketRecord.providerStatusId() != null) {
                existingTicket.setProviderStatus(statusEntityRepository.findByUuid(UUID.fromString(ticketRecord.providerStatusId()))
                        .orElseThrow(() -> new RuntimeException("Provider status not found")));
            }
            if (ticketRecord.assignedToId() != null) {
                existingTicket.setAssignedTo(userEntityRepository.findByUuid(UUID.fromString(ticketRecord.assignedToId()))
                        .orElseThrow(() -> new RuntimeException("Assigned user not found")));
            }
            if (ticketRecord.openedById() != null) {
                existingTicket.setOpenedBy(userEntityRepository.findByUuid(UUID.fromString(ticketRecord.openedById()))
                        .orElseThrow(() -> new RuntimeException("Opened by user not found")));
            }
            existingTicket.setOwnTicket(ticketRecord.ownTicket());
            existingTicket.setProviderTicket(ticketRecord.providerTicket());
            existingTicket.setRequiredBy(ticketRecord.requiredBy());
            TicketEntity updatedTicket = ticketEntityRepository.save(existingTicket);
            return new TicketDto(
                    updatedTicket.getUuid(),
                    updatedTicket.getOpenedBy().getName(),
                    updatedTicket.getOwnTicket(),
                    updatedTicket.getProviderTicket(),
                    updatedTicket.getAssignedTo().getName(),
                    updatedTicket.getRequiredBy(),
                    new StatusDto(updatedTicket.getOwnStatus()),
                    new StatusDto(updatedTicket.getProviderStatus())
            );
        } catch (Exception e) {
            throw new RuntimeException("Error updating ticket: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    @Modifying
    public void deleteTicket(UUID uuid) {
        try {
            if (ticketEntityRepository.entityExist(uuid) == null) {
                throw new RuntimeException("Ticket not found");
            }
            ticketEntityRepository.logicDelete(uuid);
        } catch (Exception e) {
            throw new RuntimeException("Error deleting ticket: " + e.getMessage());
        }
    }
}
