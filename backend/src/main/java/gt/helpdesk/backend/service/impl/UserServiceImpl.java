package gt.helpdesk.backend.service.impl;


import gt.helpdesk.backend.dto.UserDto;
import gt.helpdesk.backend.entity.user.RoleEntity;
import gt.helpdesk.backend.entity.user.UserEntity;
import gt.helpdesk.backend.records.UserRecord;
import gt.helpdesk.backend.repository.RoleEntityRepository;
import gt.helpdesk.backend.repository.UserEntityRepository;
import gt.helpdesk.backend.service.UserService;
import gt.helpdesk.backend.util.ResponseModel;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserEntityRepository userEntityRepository;
    private final RoleEntityRepository roleEntityRepository;

    @Override
    public Optional<UserEntity> findByUsername(String username) {
        return userEntityRepository.findAll().stream()
                .filter(user -> user.getUsername().equals(username))
                .findFirst();
    }

    @Override
    public Optional<UserEntity> findById(Integer id) {
        return userEntityRepository.findById(id);
    }

    @Override
    public Optional<UserEntity> findByEmail(String email) {
        return Optional.ofNullable(userEntityRepository.findByEmail(email));
    }

    @Override
    public ResponseModel<UserDto> getUserInfo(UUID uuid) {
        try {
            return ResponseModel.<UserDto>builder()
                    .message("User information retrieved successfully")
                    .data(userEntityRepository.findByUuidDto(uuid))
                    .build();
        } catch (Exception e) {
            return ResponseModel.<UserDto>builder()
                    .message("Error retrieving user information: " + e.getMessage())
                    .data(null)
                    .build();
        }
    }

    @Override
    public ResponseModel<UserDto> updateUserInfo(UUID uuid, UserRecord userRecord) {
        try {
            UserEntity userEntity = userEntityRepository.findByUuid(uuid)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            userEntity.setName(userRecord.name());

            UserEntity updatedUser = userEntityRepository.save(userEntity);

            return ResponseModel.<UserDto>builder()
                    .message("User information updated successfully")
                    .data(new UserDto(updatedUser))
                    .build();
        } catch (Exception e) {
            return ResponseModel.<UserDto>builder()
                    .message("Error updating user information: " + e.getMessage())
                    .data(null)
                    .build();
        }
    }

    @Override
    public List<UserDto> getAllUsers() {
        try {
            return userEntityRepository.getAll();
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving users: " + e.getMessage());
        }
    }

    @Override
    public UserEntity save(String email, String username, String name) {
        try {
            UserEntity userEntity = new UserEntity();
            userEntity.setEmail(email);
            userEntity.setUsername(username == null ? email : username);
            userEntity.setName(name == null ? email : name);
            final RoleEntity roleEntity = roleEntityRepository.findById(1)
                    .orElseThrow(() -> new RuntimeException("Default role not found"));
            userEntity.setRoles(List.of(roleEntity));
            return userEntityRepository.save(userEntity);
        } catch (Exception e) {
            throw new RuntimeException("Error saving user: " + e.getMessage());
        }
    }


}
