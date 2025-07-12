using Application.DTOs;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.Queries
{
    public class GetAllCategoriesQuery : IRequest<ErrorOr<IEnumerable<CategoryDto>>>
    {
    }
}
