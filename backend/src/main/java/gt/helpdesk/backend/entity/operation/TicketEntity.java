package gt.helpdesk.backend.entity.operation;

import gt.helpdesk.backend.entity.AuditEntity;
import gt.helpdesk.backend.entity.user.UserEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.io.Serial;
import java.io.Serializable;

@Entity
@Table(name = "ticket")
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class TicketEntity extends AuditEntity implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    @ManyToOne
    @JoinColumn(name = "opened_by")
    private UserEntity openedBy;

    @Column(name = "own_ticket")
    private  String ownTicket;

    @Column(name = "provider_ticket")
    private  String providerTicket;

    @ManyToOne
    @JoinColumn(name = "assigned_to")
    private UserEntity assignedTo;

    @Column(name = "required_by")
    private  String requiredBy;

    @ManyToOne
    @JoinColumn(name = "own_status_id")
    private StatusEntity ownStatus;

    @ManyToOne
    @JoinColumn(name = "provider_status_id")
    private StatusEntity providerStatus;
}
