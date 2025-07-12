using Domain.Entities;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.Commands
{
    public class UpdateOrderCommand : IRequest<ErrorOr<Updated>>
    {
        public required Guid Id { get; set; }
        public required string OrderStatus { get; set; }
        public required string DeliveryStatus { get; set; }
        public string? DeliveryProvider { get; set; }
    }
}
