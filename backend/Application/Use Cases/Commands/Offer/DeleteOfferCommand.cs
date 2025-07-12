using ErrorOr;
using MediatR;

namespace Application.Use_Cases.Commands
{
    public class DeleteOfferCommand : IRequest<ErrorOr<Deleted>>
    {
        public Guid OfferId { get; set; }
    }
}
