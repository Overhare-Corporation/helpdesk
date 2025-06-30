package gt.helpdesk.backend.util;

import lombok.Builder;


@Builder
public record ResponseModel<T>(String message, T data) {
}
