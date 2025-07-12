using Application.DTOs;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.Queries
{
    public class GetCategoriesByTitleQuery : IRequest<ErrorOr<IEnumerable<CategoryDto>>>
    {
        public required string Title { get; set; }
    }
}
