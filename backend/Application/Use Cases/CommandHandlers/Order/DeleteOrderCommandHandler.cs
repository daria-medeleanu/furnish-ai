using Application.Use_Cases.Commands;
using Domain.Repositories;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.CommandHandlers
{
    public class DeleteOrderCommandHandler : IRequestHandler<DeleteOrderCommand, ErrorOr<Deleted>>
    {
        private readonly IOrderRepository repository;
        public DeleteOrderCommandHandler(IOrderRepository repository)
        {
            this.repository = repository;
        }

        public async Task<ErrorOr<Deleted>> Handle(DeleteOrderCommand request, CancellationToken cancellationToken)
        {
            return await repository.DeleteAsync(request.Id, cancellationToken);
        }
    }
}
