package gt.helpdesk.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TicketDto {
    private String openedBy;
    private  String ownTicket;
    private  String providerTicket;
    private String assignedTo;
    private  String requiredBy;
    private StatusDto ownStatus;
    private StatusDto providerStatus;
}
