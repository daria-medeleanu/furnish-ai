using ErrorOr;
using MediatR;

namespace Application.Use_Cases.Commands
{
    public class DeleteOrderCommand : IRequest<ErrorOr<Deleted>>
    {
        public Guid Id { get; set; }
    }
}
