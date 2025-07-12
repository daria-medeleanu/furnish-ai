using ErrorOr;
using MediatR;

namespace Application.Use_Cases.Commands
{
    public class StartDeliveryCommand : IRequest<ErrorOr<Updated>>
    {
        public required Guid OrderId { get; set; }
    }
}
