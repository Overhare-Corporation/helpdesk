package gt.helpdesk.backend.dto;


import gt.helpdesk.backend.entity.user.RoleEntity;
import gt.helpdesk.backend.entity.user.UserEntity;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;


@Data
public class UserDto {
    private Integer id;
    private String email;
    private String username;
    private String name;
    private List<String> roles = new ArrayList<>();

    public UserDto(UserEntity userEntity) {
        this.id = userEntity.getId();
        this.email = userEntity.getEmail();
        this.username = userEntity.getUsername();
        if (userEntity.getRoles() != null) {
            for (RoleEntity role : userEntity.getRoles()) {
                roles.add(role.getName());
            }
        }
    }
}
