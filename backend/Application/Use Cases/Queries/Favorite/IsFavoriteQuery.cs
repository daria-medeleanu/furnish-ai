using ErrorOr;
using MediatR;

namespace Application.Use_Cases.Queries
{
    public class IsFavoriteQuery : IRequest<ErrorOr<bool>>
    {
        public Guid UserId { get; set; }
        public Guid ProductId { get; set; }
    }
}
