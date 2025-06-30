package gt.helpdesk.backend.entity.operation;

import gt.helpdesk.backend.entity.AuditEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.io.Serial;
import java.io.Serializable;

@Entity
@Table(name = "status")
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class StatusEntity extends AuditEntity implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;
    @Column(name = "name", nullable = false, unique = true)
    private String name;
@Column(name = "description")
    private String description;
@Column(name = "color")
    private String color;
@Column(name = "order_number")
    private Integer order;
}
