package gt.helpdesk.backend.repository;


import gt.helpdesk.backend.dto.UserDto;
import gt.helpdesk.backend.entity.user.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserEntityRepository extends JpaRepository<UserEntity, Integer> {
    UserEntity findByEmail(String email);

    @Query("SELECT new gt.helpdesk.backend.dto.UserDto(u) FROM UserEntity u WHERE u.id = ?1")
    UserDto findByIdDto(Integer userId);

    @Query("SELECT new gt.helpdesk.backend.dto.UserDto(u) FROM UserEntity u")
    List<UserDto> getAll();
}