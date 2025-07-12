using ErrorOr;
using MediatR;

namespace Application.Use_Cases.Commands
{
    public class AcceptOfferCommand : IRequest<ErrorOr<Updated>>
    {
        public Guid OfferId { get; set; }
    }
}
