package gt.helpdesk.backend.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@AllArgsConstructor
@RequestMapping("/webhooks")
public class WebhookController {

    @PostMapping("/register/ticket")
    public String registerTicketWebhook(@RequestBody Object ticket) {
        log.info("Received ticket webhook: {}", ticket);
        // Aquí puedes procesar el webhook del ticket
        return "Webhook for ticket received successfully";
    }
}
