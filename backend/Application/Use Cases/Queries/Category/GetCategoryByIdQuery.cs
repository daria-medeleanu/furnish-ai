using Application.DTOs;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.Queries
{
    public class GetCategoryByIdQuery : IRequest<ErrorOr<CategoryDto>>
    {
        public Guid Id { get; set; }
    }
}
