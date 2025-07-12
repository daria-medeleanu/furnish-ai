using Application.DTOs;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.Queries
{
    public class GetAllOffersByUserIdQuery : IRequest<ErrorOr<IEnumerable<OfferDto>>>
    {
        public Guid UserId { get; set; }
    }
}
