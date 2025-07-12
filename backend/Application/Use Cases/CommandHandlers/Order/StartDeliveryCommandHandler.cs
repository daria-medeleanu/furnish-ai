using Application.Use_Cases.Commands;
using Domain.Enums;
using Domain.Repositories;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.CommandHandlers
{
    public class StartDeliveryCommandHandler: IRequestHandler<StartDeliveryCommand, ErrorOr<Updated>>
    {
        private readonly IOrderRepository repository;
        public StartDeliveryCommandHandler(IOrderRepository repository)
        {
            this.repository = repository;
        }

        public async Task<ErrorOr<Updated>> Handle(StartDeliveryCommand request, CancellationToken cancellationToken)
        {
            return await repository.StartDeliveryAsync(request.OrderId, cancellationToken);
        }
    }
}
