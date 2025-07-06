package gt.helpdesk.backend.dto;


import gt.helpdesk.backend.entity.user.RoleEntity;
import gt.helpdesk.backend.entity.user.UserEntity;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;


@Data
public class UserDto {
    private UUID uuid;
    private String email;
    private String username;
    private String name;
    private List<String> roles = new ArrayList<>();

    public UserDto(UserEntity userEntity) {
        this.uuid = userEntity.getUuid();
        this.email = userEntity.getEmail();
        this.username = userEntity.getUsername();
        this.name = userEntity.getName();
        if (userEntity.getRoles() != null) {
            for (RoleEntity role : userEntity.getRoles()) {
                roles.add(role.getName());
            }
        }
    }
}
