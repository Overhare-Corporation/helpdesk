package gt.helpdesk.backend.records;

public record TicketRecord (
    Integer openedById,
    String ownTicket,
    String providerTicket,
    Integer assignedToId,
    String requiredBy,
    Integer ownStatusId,
    Integer providerStatusId
){
}
