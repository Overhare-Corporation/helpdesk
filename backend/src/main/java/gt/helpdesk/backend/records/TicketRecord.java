package gt.helpdesk.backend.records;

public record TicketRecord (
    String openedById,
    String ownTicket,
    String providerTicket,
    String assignedToId,
    String requiredBy,
    String ownStatusId,
    String providerStatusId
){
}
