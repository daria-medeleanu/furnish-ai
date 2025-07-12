using Application.DTOs;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.Queries
{
    public class GetProductByIdQuery : IRequest<ErrorOr<ProductDto>>
    {
        public Guid Id { get; set; }
    }
}
