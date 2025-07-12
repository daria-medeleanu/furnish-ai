using Application.DTOs;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.Queries
{
    public class GetOffersByProductQuery : IRequest<ErrorOr<IEnumerable<OfferDto>>>
    {
        public Guid ProductId { get; set; }
        public Guid SellerId { get; set; }
    }
}
