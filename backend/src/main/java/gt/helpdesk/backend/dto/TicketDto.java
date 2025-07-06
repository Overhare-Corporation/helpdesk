package gt.helpdesk.backend.dto;

import gt.helpdesk.backend.entity.operation.TicketEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TicketDto {
    private UUID uuid;
    private String openedBy;
    private  String ownTicket;
    private  String providerTicket;
    private String assignedTo;
    private  String requiredBy;
    private StatusDto ownStatus;
    private StatusDto providerStatus;

    public TicketDto(TicketEntity ticketEntity) {
        this.uuid = ticketEntity.getUuid();
        this.openedBy = ticketEntity.getOpenedBy() != null ? ticketEntity.getOpenedBy().getUsername() : null;
        this.ownTicket = ticketEntity.getOwnTicket();
        this.providerTicket = ticketEntity.getProviderTicket();
        this.assignedTo = ticketEntity.getAssignedTo() != null ? ticketEntity.getAssignedTo().getUsername() : null;
        this.requiredBy = ticketEntity.getRequiredBy();
        this.ownStatus = new StatusDto(ticketEntity.getOwnStatus());
        this.providerStatus = new StatusDto(ticketEntity.getProviderStatus());
    }
}
