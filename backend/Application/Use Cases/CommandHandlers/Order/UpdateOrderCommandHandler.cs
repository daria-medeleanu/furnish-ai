using Application.Use_Cases.Commands;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.CommandHandlers
{
    public class UpdateOrderCommandHandler : IRequestHandler<UpdateOrderCommand, ErrorOr<Updated>>
    {
        private readonly IOrderRepository repository;
        public UpdateOrderCommandHandler(IOrderRepository repository)
        {
            this.repository = repository;
        }

        public async Task<ErrorOr<Updated>> Handle(UpdateOrderCommand request, CancellationToken cancellationToken)
        {
            var order = new Order
            {
                Id = request.Id,
                OrderStatus = request.OrderStatus
            };

            return await repository.UpdateAsync(order, cancellationToken);
        }
    }

}
