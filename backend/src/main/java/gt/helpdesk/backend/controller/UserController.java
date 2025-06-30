package gt.helpdesk.backend.controller;

import gt.helpdesk.backend.dto.UserDto;
import gt.helpdesk.backend.records.UserRecord;
import gt.helpdesk.backend.service.UserService;
import gt.helpdesk.backend.util.ResponseModel;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    @GetMapping(value = "/all", produces = "application/json")
    public ResponseEntity<ResponseModel<List<UserDto>>> getAllUsers() {
        try {
            List<UserDto> users = userService.getAllUsers();
            ResponseModel<List<UserDto>> response = new ResponseModel<>("users retrieved successfully", users);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new ResponseModel<>("Error retrieving users: " + e.getMessage(), null));
        }
    }

    @PutMapping("/update")
    public ResponseEntity<ResponseModel<UserDto>> updateUserInfo(Integer userId, UserRecord userRecord) {
        try {
            ResponseModel<UserDto> response = userService.updateUserInfo(userId, userRecord);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new ResponseModel<>("Error updating user information: " + e.getMessage(), null));
        }
    }
}
