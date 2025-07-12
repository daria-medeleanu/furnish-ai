using ErrorOr;
using MediatR;

namespace Application.Use_Cases.Commands
{
    public class CreateCategoryCommand : IRequest<ErrorOr<Guid>>
    {
        public required string Title { get; set; }
    }
}
