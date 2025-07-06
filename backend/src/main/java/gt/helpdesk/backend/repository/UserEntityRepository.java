package gt.helpdesk.backend.repository;


import gt.helpdesk.backend.dto.UserDto;
import gt.helpdesk.backend.entity.user.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserEntityRepository extends JpaRepository<UserEntity, Integer> {
    UserEntity findByEmail(String email);

    @Query("SELECT new gt.helpdesk.backend.dto.UserDto(u) FROM UserEntity u WHERE u.uuid = ?1")
    UserDto findByUuidDto(UUID uuid);

    @Query("SELECT new gt.helpdesk.backend.dto.UserDto(u) FROM UserEntity u")
    List<UserDto> getAll();


    @Query("SELECT u FROM UserEntity u WHERE u.uuid = ?1")
    Optional<UserEntity> findByUuid(UUID uuid);

    @Query("SELECT u.id FROM UserEntity u WHERE u.uuid = ?1")
    Integer findIdByUuid(UUID uuid);
}