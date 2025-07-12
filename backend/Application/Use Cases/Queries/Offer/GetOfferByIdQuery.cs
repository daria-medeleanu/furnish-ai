using Application.DTOs;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.Queries
{
    public class GetOfferByIdQuery : IRequest<ErrorOr<OfferDto>>
    {
        public Guid Id { get; set; }
    }
}
