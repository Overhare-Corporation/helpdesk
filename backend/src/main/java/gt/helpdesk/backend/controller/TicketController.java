package gt.helpdesk.backend.controller;

import gt.helpdesk.backend.dto.TicketDto;
import gt.helpdesk.backend.entity.operation.StatusEntity;
import gt.helpdesk.backend.records.TicketRecord;
import gt.helpdesk.backend.service.TicketService;
import gt.helpdesk.backend.util.ResponseModel;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@AllArgsConstructor
@RequestMapping("/ticket")
public class TicketController {
    private final TicketService ticketService;
    @PostMapping("/create")
    public ResponseEntity<ResponseModel<TicketDto>> createTicket(@RequestBody TicketRecord ticketRecord) {
        try {
            final TicketDto ticket = ticketService.createTicket(ticketRecord);
            return ResponseEntity.ok(new ResponseModel<>("Ticket created successfully", ticket));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ResponseModel<>(e.getMessage(), null));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<ResponseModel<Page<TicketDto>>> getAllTickets(@RequestParam int page, @RequestParam int size) {
        try {
            Page<TicketDto> tickets = ticketService.getAllTickets(page, size);
            return ResponseEntity.ok(new ResponseModel<>("Tickets retrieved successfully", tickets));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ResponseModel<>(e.getMessage(), null));
        }
    }

    @GetMapping("/statuses")
    public ResponseEntity<ResponseModel<List<StatusEntity>>> getAllStatuses() {
        try {
            List<StatusEntity> statuses = ticketService.getAllStatuses();
            return ResponseEntity.ok(new ResponseModel<>("Statuses retrieved successfully", statuses));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ResponseModel<>(e.getMessage(), null));
        }
    }
}
