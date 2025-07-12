

using Application.Use_Cases.Commands;
using Domain.Enums;
using Domain.Repositories;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.CommandHandlers
{
    public class MarkDeliveredCommandHandler : IRequestHandler<MarkDeliveredCommand, ErrorOr<Updated>>
    {
        private readonly IOrderRepository repository;
        public MarkDeliveredCommandHandler(IOrderRepository repository)
        {
            this.repository = repository;
        }

        public async Task<ErrorOr<Updated>> Handle(MarkDeliveredCommand request, CancellationToken cancellationToken)
        {
            return await repository.MarkAsDeliveredAsync(request.OrderId, cancellationToken);
        }
    }
}
