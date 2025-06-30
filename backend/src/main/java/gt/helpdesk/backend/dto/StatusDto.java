package gt.helpdesk.backend.dto;

import gt.helpdesk.backend.entity.operation.StatusEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StatusDto {
    private String name;
    private String description;
    private String color;
    private Integer order;

    public StatusDto(StatusEntity statusEntity) {
        this.name = statusEntity.getName();
        this.description = statusEntity.getDescription();
        this.color = statusEntity.getColor();
        this.order = statusEntity.getOrder();
    }
}
