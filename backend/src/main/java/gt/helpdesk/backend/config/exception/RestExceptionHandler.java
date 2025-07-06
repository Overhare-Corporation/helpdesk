package gt.helpdesk.backend.config.exception;

import gt.helpdesk.backend.util.ResponseModel;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.ValidationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.List;
import java.util.stream.Collectors;

@ControllerAdvice
@Slf4j
public class RestExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(value = {ValidationException.class})
    public ResponseEntity<ResponseModel<?>> handleValidateException(ValidationException e) {
        if (e instanceof ConstraintViolationException constraintViolationException) {
            List<String> errors = constraintViolationException.getConstraintViolations().stream()
                    .map(ConstraintViolation::getMessage)
                    .collect(Collectors.toList());
            String detailedMessage = String.join("; ", errors);

            return new ResponseEntity<>(
                    new ResponseModel<>(detailedMessage, null),
                    HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(
                new ResponseModel<>(e.getMessage() == null ? "UNKNOWN ERROR" : e.getMessage(), null),
                HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(value = {Exception.class})
    public ResponseEntity<ResponseModel<?>> handleException(Exception e) {
        if (e.getCause() instanceof ValidationException c) {
            log.error("Exception: {}", c.getMessage());
            return new ResponseEntity<>(
                    new ResponseModel<>(e.getMessage() == null ? "UNKNOWN ERROR" : e.getMessage(), null),
                    HttpStatus.NOT_FOUND);
        }
        log.error("Exception: ", e);
        return new ResponseEntity<>(
                new ResponseModel<>(e.getMessage() == null ? "UNKNOWN ERROR" : "CRITICAL: " + e.getMessage(), null),
                HttpStatus.INTERNAL_SERVER_ERROR);
    }
}