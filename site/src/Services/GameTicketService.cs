using System.Collections.Concurrent;

namespace Luxora.Services;
public sealed record GameTicket(Guid Id,long UserId,long PlaceId,Guid ServerId,string Address,int Port,DateTimeOffset Expires);
public sealed class GameTicketService
{
    private readonly ConcurrentDictionary<Guid,GameTicket> _tickets=new();
    public GameTicket Issue(long userId,long placeId,StartedGameServer server){var t=new GameTicket(Guid.NewGuid(),userId,placeId,server.Id,server.Address,server.Port,DateTimeOffset.UtcNow.AddMinutes(5));_tickets[t.Id]=t;return t;}
    public GameTicket? Get(Guid id){if(!_tickets.TryGetValue(id,out var t)||t.Expires<DateTimeOffset.UtcNow){_tickets.TryRemove(id,out _);return null;}return t;}
}
