using ErrorOr;
using MediatR;

namespace Application.Use_Cases.Commands
{
    public class UpdateCategoryCommand : IRequest<ErrorOr<Updated>>
    {
        public Guid Id { get; set; }
        public required string Title { get; set; }
    }
}
