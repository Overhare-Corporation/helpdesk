package gt.helpdesk.backend.service;



import gt.helpdesk.backend.dto.UserDto;
import gt.helpdesk.backend.entity.user.UserEntity;
import gt.helpdesk.backend.records.UserRecord;
import gt.helpdesk.backend.util.ResponseModel;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public interface UserService {
    Optional<UserEntity> findByUsername(String username);

    Optional<UserEntity> findById(Integer id);

    Optional<UserEntity> findByEmail(String email);

    ResponseModel<UserDto> getUserInfo(UUID uuid);

    ResponseModel<UserDto> updateUserInfo(UUID uuid, UserRecord userRecord);

    List<UserDto> getAllUsers();

    UserEntity save(
            String email,
            String username,
            String name
    );
}
